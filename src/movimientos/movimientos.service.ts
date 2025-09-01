import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { AprobarMovimientoDto } from './dto/aprobar-movimiento.dto';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from '../tipo-movimiento/entities/tipo-movimiento.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { StockSelectionService } from 'src/stock/stock-selection.service';
import { NotificationsService } from '../notificaciones/notificaciones.service';
import { MaterialService } from '../materiales/materiales.service';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Sitio)
    private readonly sitioRepository: Repository<Sitio>,
    @InjectRepository(Detalles)
    private readonly detallesRepository: Repository<Detalles>,
    private readonly dataSource: DataSource,
    private readonly stockSelectionService: StockSelectionService,
    private readonly notificationsService: NotificationsService,
    private readonly materialService: MaterialService,
  ) {}

  // Crear nueva petición de movimiento
  async create(dto: CreateMovimientoDto) {
    return await this.dataSource.transaction(async (manager) => {
      // Validar que el material existe
      const material = await manager.findOne(Material, {
        where: { id: dto.materialId, activo: true },
      });
      if (!material) {
        throw new BadRequestException(
          `Material con ID ${dto.materialId} no encontrado o inactivo`,
        );
      }

      // Validar tipo de movimiento
      const tipoMovimiento = await manager.findOne(TipoMovimiento, {
        where: { id: dto.tipoMovimientoId },
      });
      if (!tipoMovimiento) {
        throw new BadRequestException(
          `Tipo de movimiento con ID ${dto.tipoMovimientoId} no encontrado`,
        );
      }

      // Validar personas
      const solicitante = await manager.findOne(Persona, {
        where: { id: dto.solicitanteId },
      });
      if (!solicitante) {
        throw new BadRequestException(
          `Solicitante con ID ${dto.solicitanteId} no encontrado`,
        );
      }

      // Validar aprobador solo si se proporciona
      let aprobador: Persona | null = null; // Corregir el tipo
      if (dto.aprobadorId) {
        aprobador = await manager.findOne(Persona, {
          where: { id: dto.aprobadorId },
        });
        if (!aprobador) {
          throw new BadRequestException(
            `Aprobador con ID ${dto.aprobadorId} no encontrado`,
          );
        }
      }

      // Validar sitio destino
      const sitioDestino = await manager.findOne(Sitio, {
        where: { id: dto.sitioDestinoId },
      });
      if (!sitioDestino) {
        throw new BadRequestException(
          `Sitio destino con ID ${dto.sitioDestinoId} no encontrado`,
        );
      }

      let sitioOrigen: Sitio | null = null;
      if (dto.sitioOrigenId) {
        sitioOrigen = await manager.findOne(Sitio, {
          where: { id: dto.sitioOrigenId },
        });
        if (!sitioOrigen) {
          throw new BadRequestException(
            `Sitio origen con ID ${dto.sitioOrigenId} no encontrado`,
          );
        }
      }

      // 🔒 VALIDACIÓN CRÍTICA: Evitar devoluciones múltiples del mismo préstamo
      if (tipoMovimiento.nombre.toLowerCase().includes('devolucion')) {
        // Verificar que el material sea prestado (no original)
        if (material.esOriginal) {
          throw new BadRequestException(
            'No se puede devolver un material original',
          );
        }

        // Verificar que tenga cantidad prestada
        if (!material.cantidadPrestada || material.cantidadPrestada <= 0) {
          throw new BadRequestException(
            'Este material no tiene cantidad prestada para devolver',
          );
        }

        // Verificar que la cantidad a devolver no exceda la prestada
        if (dto.cantidad > material.cantidadPrestada) {
          throw new BadRequestException(
            `Cantidad a devolver (${dto.cantidad}) excede la cantidad prestada (${material.cantidadPrestada})`,
          );
        }

        // Verificar que no existan devoluciones pendientes o aprobadas para este material
        const devolucionesPrevias = await this.movimientoRepository.count({
          where: {
            materialId: material.id,
            tipoMovimientoId: tipoMovimiento.id,
            estado: In(['NO_APROBADO', 'APROBADO']),
            activo: true,
          },
        });

        if (devolucionesPrevias > 0) {
          throw new BadRequestException(
            'Ya existe una devolución pendiente o aprobada para este material prestado',
          );
        }
      }

      // Crear el movimiento con estado NO_APROBADO
      const movimiento = manager.create(Movimiento, {
        materialId: dto.materialId,
        cantidad: dto.cantidad,
        tipoMovimientoId: dto.tipoMovimientoId,
        sitioDestinoId: dto.sitioDestinoId,
        solicitanteId: dto.solicitanteId,
        aprobadorId: dto.aprobadorId || undefined, // Cambiar null por undefined
        sitioOrigenId: dto.sitioOrigenId,
        estado: 'NO_APROBADO',
        activo: true,
      });

      const movimientoGuardado = await manager.save(Movimiento, movimiento);

      const detalle = manager.create(Detalles, {
        tipoMovimientoId: dto.tipoMovimientoId,
        materialId: dto.materialId,
        cantidad: dto.cantidad,
        estado: 'NO_APROBADO',
        solicitanteId: dto.solicitanteId,
        movimientoId: movimientoGuardado.id,
        activo: true,
      });

      await manager.save(Detalles, detalle);

      // Cargar el movimiento con sus relaciones dentro de la transacción
      const movimientoCompleto = await manager.findOne(Movimiento, {
        where: { id: movimientoGuardado.id },
        relations: [
          'material',
          'tipoMovimiento',
          'solicitante',
          'aprobador',
          'sitioDestino',
          'sitioOrigen',
        ],
      });

      // Verificar que el movimiento fue encontrado
      if (!movimientoCompleto) {
        throw new NotFoundException('No se pudo cargar el movimiento creado');
      }

      // Generar notificaciones solo si hay un aprobador asignado
      if (movimientoCompleto.aprobador) {
        await this.notificationsService.crearNotificacionSolicitud(
          movimientoCompleto,
          movimientoCompleto.solicitante,
          movimientoCompleto.aprobador,
        );
      } else {
        // Si no hay aprobador específico, crear solo notificación para el solicitante
        await this.notificationsService.create({
          tipo: 'solicitud_material',
          mensaje: `Tu solicitud de ${movimientoCompleto.cantidad} unidades de ${movimientoCompleto.material.nombre} ha sido enviada`,
          personaId: movimientoCompleto.solicitante.id,
          relacionadoId: movimientoCompleto.id,
          titulo: 'Solicitud Enviada',
        });
      }

      return {
        message: 'Petición de movimiento creada exitosamente',
        data: movimientoCompleto,
      };
    });
  }

  // Aprobar o rechazar movimiento
  async aprobarRechazar(id: number, dto: AprobarMovimientoDto) {
    return await this.dataSource.transaction(async (manager) => {
      const movimiento = await manager.findOne(Movimiento, {
        where: { id },
        relations: [
          'material',
          'tipoMovimiento',
          'sitioDestino',
          'sitioOrigen',
        ],
      });

      if (!movimiento) {
        throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
      }

      if (movimiento.estado !== 'NO_APROBADO') {
        throw new BadRequestException(
          `El movimiento ya fue procesado. Estado actual: ${movimiento.estado}`,
        );
      }

      // Actualizar estado del movimiento
      movimiento.estado = dto.estado;
      movimiento.fechaActualizacion = new Date();
      await manager.save(Movimiento, movimiento);

      // Actualizar detalle correspondiente
      await manager.update(
        Detalles,
        { movimientoId: id },
        { estado: dto.estado },
      );

      // Si se aprueba, ejecutar la lógica de movimiento de stock
      // En aprobarRechazar y aprobarRechazarByUser
      if (dto.estado === 'APROBADO') {
        await this.ejecutarMovimientoStock(manager, movimiento);
      }

      // En el método aprobarRechazarByUser
      if (dto.estado === 'APROBADO') {
        await this.ejecutarMovimientoStock(manager, movimiento);
      }

      // Generar notificación de aprobación/rechazo solo si hay aprobador
      if (movimiento.aprobador) {
        // Generar notificación de aprobación/rechazo
        await this.notificationsService.crearNotificacionAprobacion(
          movimiento,
          movimiento.solicitante,
          movimiento.aprobador,
          dto.estado,
        );

        return {
          message: `Movimiento ${dto.estado.toLowerCase()} exitosamente`,
          data: movimiento,
        };
      } else {
        // Si no hay aprobador específico, crear notificación directa para el solicitante
        const tipoNotificacion =
          dto.estado === 'APROBADO'
            ? 'solicitud_aprobada'
            : 'solicitud_rechazada';
        const mensaje =
          dto.estado === 'APROBADO'
            ? `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido aprobada`
            : `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido rechazada`;

        await this.notificationsService.create({
          tipo: tipoNotificacion,
          mensaje: mensaje,
          personaId: movimiento.solicitante.id,
          relacionadoId: movimiento.id,
          titulo:
            dto.estado === 'APROBADO'
              ? 'Solicitud Aprobada'
              : 'Solicitud Rechazada',
        });
      }

      return {
        message: `Movimiento ${dto.estado.toLowerCase()} exitosamente`,
        data: movimiento,
      };
    });
  }

  // Lógica principal de movimiento de stock
  private async ejecutarMovimientoStock(manager: any, movimiento: Movimiento) {
    switch (movimiento.tipoMovimiento.nombre.toLowerCase()) {
      case 'entrada':
        await this.procesarEntrada(manager, movimiento);
        break;
      case 'salida':
        await this.procesarSalida(manager, movimiento);
        break;
      case 'prestamo':
        // Solo procesarPrestamo, NO procesarSalida
        await this.procesarPrestamo(manager, movimiento);
        break;
      case 'devolucion':
        // Solo procesarDevolucion, NO procesarSalida
        await this.procesarDevolucion(manager, movimiento);
        break;
    }
  }

  // MÉTODO procesarEntrada - Optimizado sin logs
  private async procesarEntrada(manager: any, movimiento: Movimiento) {
    // Buscar material en sitio destino
    let materialDestino = await manager.findOne(Material, {
      where: {
        nombre: movimiento.material.nombre,
        tipoMaterialId: movimiento.material.tipoMaterialId,
        unidadMedidaId: movimiento.material.unidadMedidaId,
        sitioId: movimiento.sitioDestinoId,
      },
    });

    if (materialDestino) {
      // Crear nueva entidad Stock en lugar de sumar a material.stock
      const nuevoStock = manager.create(Stock, {
        materialId: materialDestino.id,
        cantidad: movimiento.cantidad,
        activo: true,
        requiereCodigo: false,
      });
      await manager.save('stock', nuevoStock);
    } else {
      // Crear nuevo material sin propiedad stock
      materialDestino = manager.create(Material, {
        nombre: movimiento.material.nombre,
        descripcion: movimiento.material.descripcion,
        caduca: movimiento.material.caduca,
        fechaVencimiento: movimiento.material.fechaVencimiento,
        activo: true,
        tipoMaterialId: movimiento.material.tipoMaterialId,
        unidadMedidaId: movimiento.material.unidadMedidaId,
        categoriaMaterialId: movimiento.material.categoriaMaterialId,
        requiereDevolucion: movimiento.material.requiereDevolucion,
        sitioId: movimiento.sitioDestinoId,
        registradoPorId: movimiento.solicitanteId,
        fechaCreacion: new Date(),
      });
      await manager.save(Material, materialDestino);

      // Crear Stock entity para el nuevo material
      const stockInicial = manager.create('stock', {
        materialId: materialDestino.id,
        cantidad: movimiento.cantidad,
        activo: true,
        requiereCodigo: false,
      });
      await manager.save('stock', stockInicial);
    }
  }

  // Procesar salida de material - Optimizado sin logs
  private async procesarSalida(manager: any, movimiento: Movimiento) {
    const material = movimiento.material;

    // 1. Verificar stock disponible mediante Stock entities
    const stockDisponible = await this.calcularStockDisponible(
      manager,
      material.id,
    );

    if (stockDisponible < movimiento.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para salida. Disponible: ${stockDisponible}, Solicitado: ${movimiento.cantidad}`,
      );
    }

    // 2. Reducir stock usando FIFO
    await this.reducirStockFIFO(manager, material.id, movimiento.cantidad);
  }

  // Procesar préstamo - Versión mejorada y unificada
  private async procesarPrestamo(manager: any, movimiento: Movimiento) {
    const material = movimiento.material;

    // 1. Verificar stock disponible
    const stockDisponible = await this.calcularStockDisponible(
      manager,
      material.id,
    );

    if (stockDisponible < movimiento.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${stockDisponible}, Solicitado: ${movimiento.cantidad}`,
      );
    }

    // 2. Reducir stock del material origen
    await this.reducirStockFIFO(manager, material.id, movimiento.cantidad);

    // 🆕 3. DESACTIVAR el material original si se presta completamente
    const stockRestante = await this.calcularStockDisponible(manager, material.id);
    if (stockRestante === 0) {
      material.activo = false;
      await manager.save(Material, material);
    }

    // 3. NUEVA VALIDACIÓN: Verificar si ya existe un material prestado activo
    let materialPrestado = await manager.findOne(Material, {
      where: {
        materialOrigenId: material.id,
        sitioId: movimiento.sitioDestinoId,
        esOriginal: false,
        activo: true,
        requiereDevolucion: true,
      },
    });

    if (materialPrestado) {
      const stockAdicional = manager.create('stock', {
        materialId: materialPrestado.id,
        cantidad: movimiento.cantidad,
        activo: true,
        requiereCodigo: false,
      });
      await manager.save('stock', stockAdicional);
    } else {
      materialPrestado = manager.create(Material, {
        nombre: `${material.nombre} (PRÉSTAMO)`,
        descripcion: `${material.descripcion} - Prestado desde ${material.sitio?.nombre || 'N/A'}`,
        cantidadPrestada: movimiento.cantidad,
        caduca: material.caduca,
        fechaVencimiento: material.fechaVencimiento,
        activo: true,
        tipoMaterialId: material.tipoMaterialId,
        unidadMedidaId: material.unidadMedidaId,
        categoriaMaterialId: material.categoriaMaterialId,
        requiereDevolucion: true,
        sitioId: movimiento.sitioDestinoId,
        registradoPorId: movimiento.solicitanteId,
        esOriginal: false,
        materialOrigenId: material.id,
      });

      await manager.save(Material, materialPrestado);

      // Crear stock para el nuevo material prestado
      const stockPrestado = manager.create('stock', {
        materialId: materialPrestado.id,
        cantidad: movimiento.cantidad,
        activo: true,
        requiereCodigo: false,
      });
      await manager.save('stock', stockPrestado);
    }

    // 5. Actualizar el movimiento con referencia al material prestado
    movimiento.materialPrestamoId = materialPrestado.id;
    await manager.save(Movimiento, movimiento);
  }

  // Procesar devolución - Desactivación automática de materiales prestados
  private async procesarDevolucion(manager: any, movimiento: Movimiento) {
    const materialPrestado = movimiento.material;

    // 🆕 NUEVA VALIDACIÓN: Verificar que el material prestado aún existe y está activo
    const materialPrestadoActual = await manager.findOne(Material, {
      where: { 
        id: materialPrestado.id, 
        activo: true,
        esOriginal: false,
        requiereDevolucion: true
      }
    });

    if (!materialPrestadoActual) {
      throw new BadRequestException(
        `El material prestado con ID ${materialPrestado.id} no existe, ya fue desactivado o no requiere devolución`
      );
    }

    // Usar el material actualizado de la base de datos
    const materialActualizado = materialPrestadoActual;

    // 1. Validaciones básicas
    if (materialActualizado.esOriginal) {
      throw new BadRequestException(
        'No se puede devolver un material original',
      );
    }

    if (
      !materialActualizado.materialOrigenId ||
      !materialActualizado.cantidadPrestada
    ) {
      throw new BadRequestException(
        'Material prestado sin referencia válida al origen',
      );
    }

    // 2. Encontrar el material origen
    const materialOrigen = await manager.findOne(Material, {
      where: { id: materialActualizado.materialOrigenId, activo: true },
    });

    if (!materialOrigen) {
      throw new BadRequestException('Material origen no encontrado o inactivo');
    }

    // 3. Determinar tipo de devolución
    const esDevolucionCompleta =
      movimiento.cantidad >= materialActualizado.cantidadPrestada;
    const cantidadADevolver = esDevolucionCompleta
      ? materialActualizado.cantidadPrestada
      : movimiento.cantidad;

    // 4. Devolver stock al material origen
    await this.devolverStockAlOrigen(
      manager,
      materialOrigen.id,
      cantidadADevolver,
    );

    // 🆕 5. REACTIVAR el material original al recibir devolución
    if (!materialOrigen.activo) {
      // ✅ USAR MaterialService.cambiarEstado para reactivar el material original
      await this.materialService.cambiarEstado(
        materialOrigen.id, 
        true, 
        `Reactivado automáticamente por devolución de ${cantidadADevolver} unidades`,
        movimiento.solicitanteId
      );
      console.log(`✅ Material original ${materialOrigen.nombre} reactivado por devolución`);
    }

 
    if (esDevolucionCompleta) {
     
      await this.materialService.cambiarEstado(
        materialActualizado.id, 
        false, 
        `Material desactivado automáticamente por devolución completa de ${cantidadADevolver} unidades`,
        movimiento.solicitanteId
      );
      
      // Actualizar cantidad prestada a 0
      materialActualizado.cantidadPrestada = 0;
      await manager.save(Material, materialActualizado);
      
      console.log(`✅ Material prestado ${materialActualizado.nombre} DESACTIVADO por devolución completa via PUT`);
    } else {
      // Devolución parcial: solo reducir la cantidad prestada
      materialActualizado.cantidadPrestada -= cantidadADevolver;
      await manager.save(Material, materialActualizado);
      console.log(`✅ Devolución parcial: ${cantidadADevolver} unidades. Cantidad restante: ${materialActualizado.cantidadPrestada}`);
    }

    // 7. Actualizar cantidad del movimiento para reflejar la devolución real
    movimiento.cantidad = cantidadADevolver;

    console.log(
      `✅ Devolución procesada: ${cantidadADevolver} unidades de ${materialActualizado.nombre}. Material ${esDevolucionCompleta ? 'DESACTIVADO via PUT' : 'cantidad reducida'}`
    );
  }

  // Método auxiliar para devolver stock al origen
  private async devolverStockAlOrigen(
    manager: any,
    materialOrigenId: number,
    cantidad: number,
  ) {
    // Buscar stock activo existente
    let stockOrigen = await manager.findOne(Stock, {
      where: { materialId: materialOrigenId, activo: true },
      order: { fechaCreacion: 'DESC' },
    });

    if (stockOrigen) {
      // Agregar a stock existente
      stockOrigen.cantidad += cantidad;
      await manager.save(Stock, stockOrigen);
    } else {
      // Crear nuevo stock
      const nuevoStock = manager.create(Stock, {
        materialId: materialOrigenId,
        cantidad: cantidad,
        activo: true,
        requiereCodigo: false,
        fechaCreacion: new Date(),
      });
      await manager.save(Stock, nuevoStock);
    }
  }

  // Método auxiliar para reducir stock usando FIFO
  private async reducirStockFIFO(
    manager: any,
    materialId: number,
    cantidadARreducir: number,
  ) {
    const stocksActivos = await manager.find(Stock, {
      where: { materialId, activo: true },
      order: { fechaCreacion: 'ASC' }, // FIFO
    });

    let cantidadRestante = cantidadARreducir;

    for (const stock of stocksActivos) {
      if (cantidadRestante <= 0) break;

      if (stock.cantidad >= cantidadRestante) {
        stock.cantidad -= cantidadRestante;
        if (stock.cantidad === 0) {
          stock.activo = false;
        }
        await manager.save(Stock, stock);
        cantidadRestante = 0;
      } else {
        cantidadRestante -= stock.cantidad;
        stock.cantidad = 0;
        stock.activo = false;
        await manager.save(Stock, stock);
      }
    }
  }

  // Método auxiliar para calcular stock disponible
  private async calcularStockDisponible(
    manager: any,
    materialId: number,
  ): Promise<number> {
    const stocksActivos = await manager.find(Stock, {
      where: { materialId, activo: true },
    });

    return stocksActivos.reduce((total, stock) => total + stock.cantidad, 0);
  }

  // Eliminar el método verificarYEliminarMaterialSinStock
  // Ya no es necesario porque nunca eliminamos materiales

  /**
   * 🚀 OPTIMIZADO: Calcula saldos pendientes con una sola consulta
   */
  private async calcularSaldosPendientesBatch(
    prestamoIds: number[],
  ): Promise<Map<number, number>> {
    if (prestamoIds.length === 0) {
      return new Map();
    }

    // Una sola consulta para obtener todos los materiales prestados
    const materialesPrestados = await this.materialRepository
      .createQueryBuilder('material')
      .select(['material.id', 'material.cantidadPrestada'])
      .innerJoin('movimiento', 'mov', 'mov.materialPrestamoId = material.id')
      .where('mov.id IN (:...prestamoIds)', { prestamoIds })
      .andWhere('material.activo = true')
      .andWhere('material.cantidadPrestada > 0')
      .getRawMany();

    const saldosMap = new Map<number, number>();

    // Mapear resultados
    for (const prestamo of materialesPrestados) {
      const prestamoId = prestamo.mov_id;
      const saldo = prestamo.material_cantidadPrestada || 0;
      saldosMap.set(prestamoId, saldo);
    }

    return saldosMap;
  }

  /**
   * 🚀 OPTIMIZADO: Filtra préstamos con saldo pendiente sin consultas N+1
   */
  private async filtrarPrestamosConSaldoPendienteOptimizado(
    movimientos: Movimiento[],
  ): Promise<Movimiento[]> {
    const movimientosFiltrados: Movimiento[] = [];
    const prestamoIds: number[] = [];

    // Separar préstamos de otros movimientos
    for (const movimiento of movimientos) {
      if (movimiento.tipoMovimiento?.nombre !== 'PRESTAMO') {
        movimientosFiltrados.push(movimiento);
      } else {
        prestamoIds.push(movimiento.id);
      }
    }

    // Si no hay préstamos, retornar solo los otros movimientos
    if (prestamoIds.length === 0) {
      return movimientosFiltrados;
    }

    // Obtener saldos pendientes con una sola consulta
    const saldosMap = await this.calcularSaldosPendientesBatch(prestamoIds);

    // Agregar préstamos con saldo pendiente
    for (const movimiento of movimientos) {
      if (movimiento.tipoMovimiento?.nombre === 'PRESTAMO') {
        const saldoPendiente = saldosMap.get(movimiento.id) || 0;
        if (saldoPendiente > 0) {
          (movimiento as any).saldoPendiente = saldoPendiente;
          movimientosFiltrados.push(movimiento);
        }
      }
    }

    return movimientosFiltrados;
  }

  async findPendientes() {
    const movimientos = await this.movimientoRepository.find({
      where: { estado: 'NO_APROBADO', activo: true },
      relations: [
        'material',
        'tipoMovimiento',
        'solicitante',
        'aprobador',
        'sitioDestino',
      ],
      order: { fechaPeticion: 'DESC' },
      take: 50, // 🚀 PAGINACIÓN: Limitar a 50 registros
    });

    return {
      message: 'Movimientos pendientes de aprobación',
      data: movimientos,
    };
  }

  async findOne(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: [
        'material',
        'tipoMovimiento',
        'solicitante',
        'aprobador',
        'sitioDestino',
        'sitioOrigen',
      ],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    return movimiento;
  }

  // 🚀 OPTIMIZADO: findAll con paginación y consultas optimizadas
  async findAll(filtros?: any) {
    const page = filtros?.page || 1;
    const limit = Math.min(filtros?.limit || 50, 100); // Máximo 100 registros
    const skip = (page - 1) * limit;

    const queryBuilder = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.solicitante', 'solicitante')
      .leftJoinAndSelect('movimiento.aprobador', 'aprobador')
      .leftJoinAndSelect('movimiento.sitioOrigen', 'sitioOrigen')
      .leftJoinAndSelect('movimiento.sitioDestino', 'sitioDestino');

    // Aplicar filtros existentes
    if (filtros?.estado) {
      queryBuilder.andWhere('movimiento.estado = :estado', {
        estado: filtros.estado,
      });
    }
    if (filtros?.materialId) {
      queryBuilder.andWhere('movimiento.materialId = :materialId', {
        materialId: filtros.materialId,
      });
    }
    if (filtros?.tipoMovimientoId) {
      queryBuilder.andWhere('movimiento.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId: filtros.tipoMovimientoId,
      });
    }

    const [movimientos, total] = await queryBuilder
      .orderBy('movimiento.fechaPeticion', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Filtrar préstamos completamente devueltos con consulta optimizada
    const movimientosFiltrados =
      await this.filtrarPrestamosConSaldoPendienteOptimizado(movimientos);

    return {
      data: movimientosFiltrados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 🚀 OPTIMIZADO: findByUser con paginación
  async findByUser(userId: number, filtros?: any) {
    const page = filtros?.page || 1;
    const limit = Math.min(filtros?.limit || 50, 100);
    const skip = (page - 1) * limit;

    const queryBuilder = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.solicitante', 'solicitante')
      .leftJoinAndSelect('movimiento.aprobador', 'aprobador')
      .leftJoinAndSelect('movimiento.sitioOrigen', 'sitioOrigen')
      .leftJoinAndSelect('movimiento.sitioDestino', 'sitioDestino')
      .where('movimiento.solicitanteId = :userId', { userId });

    // Aplicar filtros existentes
    if (filtros?.estado) {
      queryBuilder.andWhere('movimiento.estado = :estado', {
        estado: filtros.estado,
      });
    }
    if (filtros?.materialId) {
      queryBuilder.andWhere('movimiento.materialId = :materialId', {
        materialId: filtros.materialId,
      });
    }
    if (filtros?.tipoMovimientoId) {
      queryBuilder.andWhere('movimiento.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId: filtros.tipoMovimientoId,
      });
    }

    const [movimientos, total] = await queryBuilder
      .orderBy('movimiento.fechaPeticion', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Filtrar préstamos completamente devueltos con consulta optimizada
    const movimientosFiltrados =
      await this.filtrarPrestamosConSaldoPendienteOptimizado(movimientos);

    return {
      data: movimientosFiltrados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Obtener movimientos pendientes donde el usuario es aprobador
  async findPendientesByAprobador(aprobadorId: number) {
    const movimientos = await this.movimientoRepository.find({
      where: { estado: 'NO_APROBADO', activo: true, aprobadorId },
      relations: [
        'material',
        'tipoMovimiento',
        'solicitante',
        'aprobador',
        'sitioDestino',
      ],
      order: { fechaPeticion: 'DESC' },
      take: 50, // 🚀 PAGINACIÓN: Limitar a 50 registros
    });

    return {
      message: 'Movimientos pendientes de aprobación para el usuario',
      data: movimientos,
    };
  }

  // Obtener movimientos solicitados por el usuario
  async findSolicitadosByUser(solicitanteId: number, filtros?: any) {
    const query = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.solicitante', 'solicitante')
      .leftJoinAndSelect('movimiento.aprobador', 'aprobador')
      .leftJoinAndSelect('movimiento.sitioDestino', 'sitioDestino')
      .leftJoinAndSelect('movimiento.sitioOrigen', 'sitioOrigen')
      .where('movimiento.activo = :activo', { activo: true })
      .andWhere('movimiento.solicitanteId = :solicitanteId', { solicitanteId })
      .orderBy('movimiento.fechaPeticion', 'DESC')
      .take(50); // 🚀 PAGINACIÓN: Limitar a 50 registros

    if (filtros?.estado) {
      query.andWhere('movimiento.estado = :estado', { estado: filtros.estado });
    }

    const movimientos = await query.getMany();

    return {
      message: 'Movimientos solicitados por el usuario',
      data: movimientos,
    };
  }

  // Verificar que un movimiento pertenece al usuario (como solicitante o aprobador)
  async findOneByUser(id: number, userId: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: [
        { id, solicitanteId: userId },
        { id, aprobadorId: userId },
      ],
      relations: [
        'material',
        'tipoMovimiento',
        'solicitante',
        'aprobador',
        'sitioDestino',
        'sitioOrigen',
      ],
    });

    if (!movimiento) {
      throw new NotFoundException(
        `Movimiento con ID ${id} no encontrado o no pertenece al usuario`,
      );
    }

    return movimiento;
  }

  // Versión segura de aprobar/rechazar que verifica el aprobador - Optimizada sin logs
  async aprobarRechazarByUser(
    id: number,
    dto: AprobarMovimientoDto,
    aprobadorId: number,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      const movimiento = await manager.findOne(Movimiento, {
        where: { id, aprobadorId }, // Verificar que el usuario sea el aprobador
        relations: [
          'material',
          'tipoMovimiento',
          'solicitante',
          'aprobador',
          'sitioDestino',
          'sitioOrigen',
        ],
      });

      if (!movimiento) {
        throw new NotFoundException(
          `Movimiento con ID ${id} no encontrado o no tienes permisos para aprobarlo`,
        );
      }

      if (movimiento.estado !== 'NO_APROBADO') {
        throw new BadRequestException(
          `El movimiento ya fue procesado. Estado actual: ${movimiento.estado}`,
        );
      }

      // Actualizar estado del movimiento
      movimiento.estado = dto.estado;
      movimiento.fechaActualizacion = new Date();
      await manager.save(Movimiento, movimiento);

      // Actualizar detalle correspondiente
      await manager.update(
        Detalles,
        { movimientoId: id },
        { estado: dto.estado },
      );

      // Si se aprueba, ejecutar la lógica de movimiento de stock
      if (dto.estado === 'APROBADO') {
        await this.ejecutarMovimientoStock(manager, movimiento);
      }

      // Generar notificación de aprobación/rechazo
      if (!movimiento.aprobador) {
        throw new BadRequestException(
          'El movimiento no tiene un aprobador asignado',
        );
      }

      await this.notificationsService.crearNotificacionAprobacion(
        movimiento,
        movimiento.solicitante,
        movimiento.aprobador,
        dto.estado,
      );

      return {
        message: `Movimiento ${dto.estado.toLowerCase()} exitosamente`,
        data: movimiento,
      };
    });
  }

  // ✅ NUEVO MÉTODO: Aprobar movimiento y cambiar estado del material
  async aprobarYCambiarEstadoMaterial(
    movimientoId: number,
    materialId: number,
    nuevoEstado: boolean,
    dto: AprobarMovimientoDto,
    usuarioId: number
  ) {
    return this.dataSource.transaction(async (manager) => {
      try {
        // 1. Aprobar el movimiento normalmente
        const movimientoAprobado = await this.aprobarRechazarByUser(
          movimientoId, 
          dto, 
          usuarioId
        );

        // 2. Cambiar el estado del material directamente
        await this.materialService.cambiarEstado(
          materialId,
          nuevoEstado,
          `Estado cambiado automáticamente por aprobación de movimiento ${movimientoId}`,
          usuarioId
        );

        console.log(`✅ Movimiento ${movimientoId} aprobado y material ${materialId} ${nuevoEstado ? 'activado' : 'desactivado'}`);

        return {
          message: `Movimiento aprobado y material ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
          movimiento: movimientoAprobado,
          materialEstado: nuevoEstado
        };
      } catch (error) {
        console.error('Error en aprobarYCambiarEstadoMaterial:', error);
        throw new BadRequestException(
          `Error al aprobar movimiento y cambiar estado del material: ${error.message}`
        );
      }
    });
  }
}

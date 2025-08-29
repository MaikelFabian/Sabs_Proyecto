import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
  ) {}

  // Crear nueva petición de movimiento
  async create(dto: CreateMovimientoDto) {
    return await this.dataSource.transaction(async (manager) => {
      console.log('🚀 Creando nueva petición de movimiento');

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

      const aprobador = await manager.findOne(Persona, {
        where: { id: dto.aprobadorId },
      });
      if (!aprobador) {
        throw new BadRequestException(
          `Aprobador con ID ${dto.aprobadorId} no encontrado`,
        );
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

      // Crear el movimiento con estado NO_APROBADO
      const movimiento = manager.create(Movimiento, {
        materialId: dto.materialId,
        cantidad: dto.cantidad,
        tipoMovimientoId: dto.tipoMovimientoId,
        sitioDestinoId: dto.sitioDestinoId,
        solicitanteId: dto.solicitanteId,
        aprobadorId: dto.aprobadorId,
        descripcion: dto.descripcion,
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

      console.log('✅ Petición de movimiento creada exitosamente');
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
          movimientoCompleto.aprobador
        );
      } else {
        // Si no hay aprobador específico, crear solo notificación para el solicitante
        await this.notificationsService.create({
          tipo: 'solicitud_material',
          mensaje: `Tu solicitud de ${movimientoCompleto.cantidad} unidades de ${movimientoCompleto.material.nombre} ha sido enviada`,
          personaId: movimientoCompleto.solicitante.id,
          relacionadoId: movimientoCompleto.id,
          titulo: 'Solicitud Enviada'
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
      console.log(
        `🔄 ${dto.estado === 'APROBADO' ? 'Aprobando' : 'Rechazando'} movimiento ${id}`,
      );

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
          dto.estado
        );

        return {
          message: `Movimiento ${dto.estado.toLowerCase()} exitosamente`,
          data: movimiento,
        };
      } else {
        // Si no hay aprobador específico, crear notificación directa para el solicitante
        const tipoNotificacion = dto.estado === 'APROBADO' ? 'solicitud_aprobada' : 'solicitud_rechazada';
        const mensaje = dto.estado === 'APROBADO' 
          ? `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido aprobada`
          : `Tu solicitud de ${movimiento.cantidad} unidades de ${movimiento.material.nombre} ha sido rechazada`;
        
        await this.notificationsService.create({
          tipo: tipoNotificacion,
          mensaje: mensaje,
          personaId: movimiento.solicitante.id,
          relacionadoId: movimiento.id,
          titulo: dto.estado === 'APROBADO' ? 'Solicitud Aprobada' : 'Solicitud Rechazada'
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
    const tipoMovimiento = movimiento.tipoMovimiento.nombre.toLowerCase();
    console.log(`📦 Ejecutando movimiento de tipo: ${tipoMovimiento}`);

    switch (tipoMovimiento) {
      case 'entrada':
        await this.procesarEntrada(manager, movimiento);
        break;
      case 'salida':
        await this.procesarSalida(manager, movimiento);
        break;
      case 'prestamo':
      case 'préstamo':
        await this.procesarPrestamo(manager, movimiento);
        break;
      case 'devolucion':
      case 'devolución':
        await this.procesarDevolucion(manager, movimiento);
        break;
      default:
        throw new BadRequestException(
          `Tipo de movimiento '${tipoMovimiento}' no soportado`,
        );
    }
  }

  // MÉTODO procesarEntrada - Líneas 248, 254
  private async procesarEntrada(manager: any, movimiento: Movimiento) {
    console.log('📥 Procesando entrada de material - USANDO STOCK ENTITIES');

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
      // ✅ CORREGIDO: Crear nueva entidad Stock en lugar de sumar a material.stock
      const nuevoStock = manager.create(Stock, {
        materialId: materialDestino.id,
        cantidad: movimiento.cantidad,
        activo: true,
        requiereCodigo: false,
      });
      await manager.save('stock', nuevoStock);
      console.log(
        `✅ Stock agregado mediante Stock entity: +${movimiento.cantidad}`,
      );
    } else {
      // ✅ CORREGIDO: Crear nuevo material sin propiedad stock
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
      console.log(
        `✅ Nuevo material creado con Stock entity: ${movimiento.cantidad}`,
      );
    }
  }

  // Procesar salida de material
  private async procesarSalida(manager: any, movimiento: Movimiento) {
    const material = movimiento.material;

    console.log('📤 Procesando salida - USANDO STOCK ENTITIES');
    console.log(`📋 Material: ${material.nombre} (ID: ${material.id})`);
    console.log(`📦 Cantidad a sacar: ${movimiento.cantidad}`);

    // 1. Verificar stock disponible mediante Stock entities
    const stocksActivos = await manager.find('stock', {
      where: { materialId: material.id, activo: true },
    });

    const stockDisponible = stocksActivos.reduce(
      (total, stock) => total + stock.cantidad,
      0,
    );

    if (stockDisponible < movimiento.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para salida. Disponible: ${stockDisponible}, Solicitado: ${movimiento.cantidad}`,
      );
    }

    // 2. Reducir stock de las entidades Stock (FIFO)
    let cantidadRestante = movimiento.cantidad;
    for (const stock of stocksActivos) {
      if (cantidadRestante <= 0) break;

      if (stock.cantidad >= cantidadRestante) {
        stock.cantidad -= cantidadRestante;
        if (stock.cantidad === 0) {
          stock.activo = false;
        }
        await manager.save('stock', stock);
        cantidadRestante = 0;
      } else {
        cantidadRestante -= stock.cantidad;
        stock.cantidad = 0;
        stock.activo = false;
        await manager.save('stock', stock);
      }
    }

    console.log(`✅ Salida procesada: -${movimiento.cantidad}`);

    // ✅ NUEVO: Verificar y eliminar material si stock llega a cero
    await this.verificarYEliminarMaterialSinStock(manager, material.id);
  }

  // Procesar préstamo con rastreo de stocks específicos
  // ✅ NUEVA LÓGICA: Procesar préstamo sin propiedad stock
  private async procesarPrestamo(manager: any, movimiento: Movimiento) {
    const material = movimiento.material;

    console.log('🔄 Procesando préstamo - SIN PROPIEDAD STOCK');
    console.log(`📋 Material origen: ${material.nombre} (ID: ${material.id})`);
    console.log(`📦 Cantidad a prestar: ${movimiento.cantidad}`);
    console.log(`🎯 Sitio destino: ${movimiento.sitioDestinoId}`);

    // 1. Verificar stock disponible mediante Stock entities
    const stocksActivos = await manager.find('stock', {
      where: { materialId: material.id, activo: true },
    });

    const stockDisponible = stocksActivos.reduce(
      (total, stock) => total + stock.cantidad,
      0,
    );

    if (stockDisponible < movimiento.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${stockDisponible}, Solicitado: ${movimiento.cantidad}`,
      );
    }

    // 2. Reducir stock de las entidades Stock (FIFO)
    let cantidadRestante = movimiento.cantidad;
    for (const stock of stocksActivos) {
      if (cantidadRestante <= 0) break;

      if (stock.cantidad >= cantidadRestante) {
        stock.cantidad -= cantidadRestante;
        if (stock.cantidad === 0) {
          stock.activo = false;
        }
        await manager.save('stock', stock);
        cantidadRestante = 0;
      } else {
        cantidadRestante -= stock.cantidad;
        stock.cantidad = 0;
        stock.activo = false;
        await manager.save('stock', stock);
      }
    }

    // 3. Crear material prestado en sitio destino
    const materialPrestado = manager.create(Material, {
      nombre: material.nombre,
      descripcion: `${material.descripcion} (PRESTADO)`,
      cantidadPrestada: movimiento.cantidad, // ✅ USAR cantidadPrestada en lugar de stock
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
    console.log(`✅ Material prestado creado: ID ${materialPrestado.id}`);

    // Método procesarPrestamo - PASO 4 CRÍTICO
    // 4. ✅ NUEVO: Crear entidad Stock para el material prestado
    const stockPrestado = manager.create('stock', {
      materialId: materialPrestado.id,
      cantidad: movimiento.cantidad,
      activo: true,
      requiereCodigo: false,
    });
    await manager.save('stock', stockPrestado);
    console.log(
      `✅ Stock creado para material prestado: +${movimiento.cantidad}`,
    );

    // ✅ NUEVO: Verificar y eliminar material origen si stock llega a cero
    await this.verificarYEliminarMaterialSinStock(manager, material.id);

    // 5. Actualizar el movimiento con referencia al material prestado
    movimiento.materialPrestamoId = materialPrestado.id;
    await manager.save(Movimiento, movimiento);
  }

  // ✅ NUEVA LÓGICA: Procesar devolución con eliminación completa vs resta parcial
  private async procesarDevolucion(manager: any, movimiento: Movimiento) {
    const materialPrestado = movimiento.material;

    console.log('🔙 Procesando devolución - LÓGICA COMPLETA vs PARCIAL');
    console.log(
      `📋 Material prestado: ${materialPrestado.nombre} (ID: ${materialPrestado.id})`,
    );
    console.log(
      `📦 Cantidad prestada actual: ${materialPrestado.cantidadPrestada}`,
    );
    console.log(`📦 Cantidad a devolver: ${movimiento.cantidad}`);

    // 1. Validaciones básicas
    if (materialPrestado.esOriginal) {
      throw new BadRequestException(
        'No se puede devolver un material original',
      );
    }

    if (!materialPrestado.materialOrigenId) {
      throw new BadRequestException(
        'Material prestado sin referencia al origen',
      );
    }

    if (!materialPrestado.cantidadPrestada) {
      throw new BadRequestException('Material prestado sin cantidad prestada');
    }

    if (materialPrestado.cantidadPrestada < movimiento.cantidad) {
      throw new BadRequestException(
        `Cantidad a devolver excede la cantidad prestada. Disponible: ${materialPrestado.cantidadPrestada}, A devolver: ${movimiento.cantidad}`,
      );
    }

    // 2. Encontrar el material origen
    // ANTES (incorrecto):
    // where: { materialPrestado.materialOrigenId, activo: true }
    
    // DESPUÉS (corregido):
    const materialOrigen = await manager.findOne(Material, {
    where: { id: materialPrestado.materialOrigenId, activo: true },
    });

    if (!materialOrigen) {
      throw new BadRequestException('Material origen no encontrado o inactivo');
    }


    // Corregir línea 478 - cambiar de:
    // await manager.update(Detalles, {... }, {...}) ;
    
    // A una sintaxis válida como:
    // Líneas 495-497 - procesarDevolucion
    // Cambiar de:
    // await manager.update(
    //   'detalles',
    //   { materialId: materialPrestado.id },
    //   { activo: false },
    // );
    // A:
    await manager.update(
      Detalles,
      { materialId: materialPrestado.id },
      { activo: false },
    );
    
    // Línea 607 - verificarYEliminarMaterialSinStock
    // Cambiar de:
    // await manager.update('detalles', { materialId }, { activo: false });
    // A:
    await manager.update(Detalles, { materialOrigenId: materialOrigen.id }, { activo: false });
    console.log(`✅ Stock devuelto al origen: +${movimiento.cantidad}`);

    // 4. ✅ LÓGICA CRÍTICA: Devolución completa vs parcial
    if (movimiento.cantidad === materialPrestado.cantidadPrestada) {
      // 🗑️ DEVOLUCIÓN COMPLETA: Eliminar material prestado completamente
      console.log('🗑️ DEVOLUCIÓN COMPLETA - Eliminando material prestado');

      // Desactivar detalles relacionados para preservar historial
      await manager.update(
        'detalles',
        { materialId: materialPrestado.id },
        { activo: false },
      );

      // Eliminar el material prestado completamente
      await manager.remove(Material, materialPrestado);
      console.log('✅ Material prestado eliminado completamente');
    } else {
      // ➖ DEVOLUCIÓN PARCIAL: Restar cantidad del material prestado Y su stock
      console.log('➖ DEVOLUCIÓN PARCIAL - Restando cantidad y stock');

      // Método procesarDevolucion - DEVOLUCIÓN PARCIAL CORREGIDA
      // ✅ NUEVO: Reducir stock del material prestado
      const stocksPrestados = await manager.find('stock', {
        where: { materialId: materialPrestado.id, activo: true },
      });

      let cantidadAReducir = movimiento.cantidad;
      for (const stock of stocksPrestados) {
        if (cantidadAReducir <= 0) break;

        if (stock.cantidad >= cantidadAReducir) {
          stock.cantidad -= cantidadAReducir;
          if (stock.cantidad === 0) {
            stock.activo = false;
          }
          await manager.save('stock', stock);
          cantidadAReducir = 0;
        } else {
          cantidadAReducir -= stock.cantidad;
          stock.cantidad = 0;
          stock.activo = false;
          await manager.save('stock', stock);
        }
      }
      console.log(
        `✅ Stock del material prestado reducido: -${movimiento.cantidad}`,
      );

      // Actualizar cantidadPrestada
      if (materialPrestado.cantidadPrestada! < movimiento.cantidad) {
        materialPrestado.cantidadPrestada = 0;
      } else {
        materialPrestado.cantidadPrestada! -= movimiento.cantidad;
      }
      await manager.save(Material, materialPrestado);
      console.log(
        `✅ Cantidad prestada actualizada: ${materialPrestado.cantidadPrestada}`,
      );
    }
  }

  // ✅ NUEVO: Método auxiliar para eliminar materiales cuando stock llega a cero
  private async verificarYEliminarMaterialSinStock(
    manager: any,
    materialId: number,
  ) {
    console.log(`🔍 Verificando stock total del material ID: ${materialId}`);

    // 1. Calcular stock total activo del material
    const stocksActivos = await manager.find('stock', {
      where: { materialId, activo: true },
    });

    const stockTotal = stocksActivos.reduce(
      (total, stock) => total + stock.cantidad,
      0,
    );
    console.log(`📊 Stock total calculado: ${stockTotal}`);

    // 2. Si el stock total es cero, eliminar el material
    if (stockTotal === 0) {
      console.log(
        `🗑️ ELIMINACIÓN AUTOMÁTICA: Material ID ${materialId} tiene stock cero`,
      );

      // Verificar que el material existe y es original (no prestado)
      const material = await manager.findOne(Material, {
        where: { id: materialId, activo: true },
      });

      if (!material) {
        console.log(`⚠️ Material ID ${materialId} no encontrado o ya inactivo`);
        return;
      }

      if (material.esOriginal === false) {
        console.log(
          `⚠️ Material ID ${materialId} es prestado, no se elimina automáticamente`,
        );
        return;
      }

      // Verificar que no tenga préstamos activos
      const prestamosActivos = await manager.count(Material, {
        where: { materialOrigenId: materialId, activo: true },
      });

      if (prestamosActivos > 0) {
        console.log(
          `⚠️ Material ID ${materialId} tiene ${prestamosActivos} préstamos activos, no se puede eliminar`,
        );
        return;
      }

      try {
        // 3. Desactivar stocks relacionados (ya deberían estar inactivos)
        await manager.update('stock', { materialId }, { activo: false });

        // 4. Desactivar detalles relacionados para preservar historial
        await manager.update('detalles', { materialId }, { activo: false });

        // 5. Eliminar el material
        await manager.remove(Material, material);

        console.log(
          `✅ Material "${material.nombre}" eliminado automáticamente por stock cero`,
        );
      } catch (error) {
        console.error(`❌ Error al eliminar material ID ${materialId}:`, error);
      }
    } else {
      console.log(`✅ Material ID ${materialId} mantiene stock: ${stockTotal}`);
    }
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

  async findAll(filtros?: any) {
    const query = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.solicitante', 'solicitante')
      .leftJoinAndSelect('movimiento.aprobador', 'aprobador')
      .leftJoinAndSelect('movimiento.sitioDestino', 'sitioDestino')
      .leftJoinAndSelect('movimiento.sitioOrigen', 'sitioOrigen')
      .where('movimiento.activo = :activo', { activo: true })
      .orderBy('movimiento.fechaPeticion', 'DESC');

    if (filtros?.estado) {
      query.andWhere('movimiento.estado = :estado', { estado: filtros.estado });
    }
    if (filtros?.materialId) {
      query.andWhere('movimiento.materialId = :materialId', {
        materialId: filtros.materialId,
      });
    }
    if (filtros?.tipoMovimientoId) {
      query.andWhere('movimiento.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId: filtros.tipoMovimientoId,
      });
    }

    const movimientos = await query.getMany();

    return {
      message: 'Movimientos obtenidos exitosamente',
      data: movimientos,
    };
  }

  // NUEVOS MÉTODOS - Agregar al final del archivo antes del cierre de clase
  
  // Obtener movimientos donde el usuario es solicitante o aprobador
  async findByUser(userId: number, filtros?: any) {
    const query = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.solicitante', 'solicitante')
      .leftJoinAndSelect('movimiento.aprobador', 'aprobador')
      .leftJoinAndSelect('movimiento.sitioDestino', 'sitioDestino')
      .leftJoinAndSelect('movimiento.sitioOrigen', 'sitioOrigen')
      .where('movimiento.activo = :activo', { activo: true })
      .andWhere('(movimiento.solicitanteId = :userId OR movimiento.aprobadorId = :userId)', { userId })
      .orderBy('movimiento.fechaPeticion', 'DESC');

    if (filtros?.estado) {
      query.andWhere('movimiento.estado = :estado', { estado: filtros.estado });
    }
    if (filtros?.materialId) {
      query.andWhere('movimiento.materialId = :materialId', {
        materialId: filtros.materialId,
      });
    }
    if (filtros?.tipoMovimientoId) {
      query.andWhere('movimiento.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId: filtros.tipoMovimientoId,
      });
    }

    const movimientos = await query.getMany();

    return {
      message: 'Movimientos del usuario obtenidos exitosamente',
      data: movimientos,
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
      .orderBy('movimiento.fechaPeticion', 'DESC');

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
        { id, aprobadorId: userId }
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
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado o no pertenece al usuario`);
    }

    return movimiento;
  }

  // Versión segura de aprobar/rechazar que verifica el aprobador
  async aprobarRechazarByUser(id: number, dto: AprobarMovimientoDto, aprobadorId: number) {
    return await this.dataSource.transaction(async (manager) => {
      console.log(`🔄 ${dto.estado === 'APROBADO' ? 'Aprobando' : 'Rechazando'} movimiento ${id} por usuario ${aprobadorId}`);

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
        throw new NotFoundException(`Movimiento con ID ${id} no encontrado o no tienes permisos para aprobarlo`);
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
        throw new BadRequestException('El movimiento no tiene un aprobador asignado');
      }

      await this.notificationsService.crearNotificacionAprobacion(
        movimiento,
        movimiento.solicitante,
        movimiento.aprobador,
        dto.estado
      );

      return {
        message: `Movimiento ${dto.estado.toLowerCase()} exitosamente`,
        data: movimiento,
      };
    });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Detalles } from '../detalles/entities/detalle.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sitio } from '../sitios/entities/sitio.entity'; // Agregar import
import { In, Repository, MoreThan } from 'typeorm';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { StockService } from '../stock/stock.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly repo: Repository<Material>,
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    @InjectRepository(Detalles)
    private readonly detallesRepo: Repository<Detalles>,
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,
    @InjectRepository(Sitio) // Agregar repositorio de Sitio
    private readonly sitioRepo: Repository<Sitio>,
    private readonly stockService: StockService,
  ) {}

  async create(dto: CreateMaterialDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Material creado', data: guardado };
  }

  async obtenerStockCompleto() {
    return this.repo.find({
      select: ['id', 'nombre', 'descripcion', 'activo', 'fechaVencimiento'],
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'stocks',
      ],
      where: { activo: true },
    });
  }

  async findAll() {
    const lista = await this.repo.find({
      where: { activo: true },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    return { message: 'Listado de materiales', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id, activo: true },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    if (!encontrado)
      throw new NotFoundException(`Material no encontrado id: ${id}`);
    return { message: 'Material encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const {
      detalles,
      movimientos,
      tipoMaterial,
      unidadMedida,
      categoriaMaterial,
      registradoPor,
      stocks,
      ...updateData
    } = dto as any;

    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    return { message: 'Material actualizado', data: actualizado };
  }

  async remove(id: number) {
    // 1. Verificar si el material existe
    const material = await this.repo.findOne({
      where: { id },
      relations: ['materialOrigen', 'stocks'],
    });
    if (!material) {
      throw new NotFoundException(`Material no encontrado con ID: ${id}`);
    }

    console.log(
      `🗑️ Iniciando eliminación del material ID ${id}: ${material.nombre}`,
    );

    try {
      // 2. Si es un material prestado con cantidad pendiente, procesar devolución automática
      if (material.materialOrigenId && (material.cantidadPrestada ?? 0) > 0) {
        console.log(
          `🔄 Procesando devolución automática de ${material.cantidadPrestada} unidades`,
        );

        // Procesar devolución automática completa
        await this.procesarDevolucionAutomatica(material);

        console.log(`✅ Devolución automática completada`);
      }

      // 3. Si es un material original con préstamos activos, procesar devoluciones automáticas
      if (material.esOriginal) {
        const prestamosActivos = await this.repo.find({
          where: {
            materialOrigenId: id,
            cantidadPrestada: MoreThan(0),
          },
        });

        if (prestamosActivos.length > 0) {
          console.log(
            `🔄 Procesando ${prestamosActivos.length} devoluciones automáticas de préstamos activos`,
          );

          for (const prestamo of prestamosActivos) {
            await this.procesarDevolucionAutomatica(prestamo);
          }

          console.log(`✅ Todas las devoluciones automáticas completadas`);
        }
      }

      // 4. Eliminar registros de Stock asociados
      const stocksCount = await this.stockRepo.count({
        where: { materialId: id },
      });
      console.log(`📊 Stocks encontrados: ${stocksCount}`);

      if (stocksCount > 0) {
        await this.stockRepo.delete({ materialId: id });
        console.log(`✅ Stocks eliminados: ${stocksCount} registros`);
      }

      // 5. Desvincular referencias en Detalles (preservar historial)
      const detallesCount = await this.detallesRepo.count({
        where: { materialId: id },
      });
      console.log(
        `📊 Detalles encontrados que referencian el material: ${detallesCount}`,
      );

      if (detallesCount > 0) {
        const updateResult = await this.detallesRepo.update(
          { materialId: id },
          {
            activo: false, // Marcar como inactivo para indicar que el material fue eliminado
          },
        );
        console.log(
          `✅ Detalles desvinculados: ${updateResult.affected} registros`,
        );
      }

      // 6. Eliminar movimientos relacionados (tanto como material principal como préstamo)
      const movimientosCount = await this.movimientoRepo.count({
        where: [{ materialId: id }, { materialPrestamoId: id }],
      });
      console.log(`📊 Movimientos encontrados: ${movimientosCount}`);

      if (movimientosCount > 0) {
        await this.movimientoRepo.delete({ materialId: id });
        await this.movimientoRepo.delete({ materialPrestamoId: id });
        console.log(`✅ Movimientos eliminados: ${movimientosCount} registros`);
      }

      // 7. Eliminar el material
      await this.repo.delete(id);
      console.log(`✅ Material eliminado exitosamente`);

      return {
        message: `Material "${material.nombre}" eliminado exitosamente. Historial preservado en ${detallesCount} detalles.`,
        data: {
          materialEliminado: material.nombre,
          stocksEliminados: stocksCount,
          detallesPreservados: detallesCount,
          movimientosEliminados: movimientosCount,
        },
      };
    } catch (error) {
      console.error(`❌ Error al eliminar material ID ${id}:`, error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error al eliminar material: ${error.message}`,
      );
    }
  }

  // ✅ NUEVOS MÉTODOS para trabajar con Stock
  async getMaterialWithActiveStocks(id: number) {
    const material = await this.repo.findOne({
      where: { id },
      relations: [
        'stocks',
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
      ],
    });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${id}`);

    // Filtrar solo stocks activos
    const activeStocks = material.stocks?.filter((stock) => stock.activo) || [];

    return {
      message: 'Material con stocks activos',
      data: { ...material, activeStocks },
    };
  }

  async getTotalActiveStock(materialId: number): Promise<number> {
    const material = await this.repo.findOne({
      where: { id: materialId },
      relations: ['stocks'],
    });
    if (!material)
      throw new NotFoundException(`Material no encontrado id: ${materialId}`);

    return (
      material.stocks
        ?.filter((stock) => stock.activo)
        .reduce((total, stock) => total + stock.cantidad, 0) || 0
    );
  }

  // Nuevos métodos con filtrado por usuario
  async findByUserSite(userId: number) {
    // Obtener sitios del usuario desde su perfil/permisos
    const userSites = await this.getUserSites(userId);

    const lista = await this.repo.find({
      where: {
        activo: true,
        sitioId: In(userSites),
      },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });
    return { message: 'Materiales del usuario', data: lista };
  }

  async findOneByUser(id: number, userId: number) {
    const userSites = await this.getUserSites(userId);

    const encontrado = await this.repo.findOne({
      where: {
        id,
        activo: true,
        sitioId: In(userSites),
      },
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'detalles',
        'sitio',
        'registradoPor',
        'stocks',
      ],
    });

    if (!encontrado) {
      throw new NotFoundException(
        `Material no encontrado o no tienes acceso a él`,
      );
    }

    return { message: 'Material encontrado', data: encontrado };
  }

  async obtenerStockCompletoByUser(userId: number) {
    const userSites = await this.getUserSites(userId);

    return this.repo.find({
      select: ['id', 'nombre', 'descripcion', 'activo', 'fechaVencimiento'],
      relations: [
        'tipoMaterial',
        'unidadMedida',
        'categoriaMaterial',
        'stocks',
      ],
      where: {
        activo: true,
        sitioId: In(userSites),
      },
    });
  }

  // Método auxiliar para obtener sitios del usuario (solución temporal)
  private async getUserSites(userId: number): Promise<number[]> {
    // SOLUCIÓN TEMPORAL: Retornar todos los sitios activos
    // TODO: Implementar lógica específica de usuario-sitio según requerimientos
    const sitiosActivos = await this.sitioRepo.find({
      where: { activo: true },
      select: ['id'],
    });

    return sitiosActivos.map((sitio) => sitio.id);
  }

  // 🚀 VERSIÓN CORREGIDA - Soluciona error 500 y errores de TypeScript
  async findMaterialesPrestadosConSaldoPendiente(
    userId: number,
    page: number = 1,
    limit: number = 50,
  ) {
    try {
      const userSites = await this.getUserSites(userId);
      const maxLimit = Math.min(limit, 100);
      const skip = (page - 1) * maxLimit;

      // 🚀 CONSULTA SIMPLIFICADA sin having problemático
      const materialesQuery = this.repo
        .createQueryBuilder('material')
        .leftJoinAndSelect('material.tipoMaterial', 'tipoMaterial')
        .leftJoinAndSelect('material.unidadMedida', 'unidadMedida')
        .leftJoinAndSelect('material.categoriaMaterial', 'categoriaMaterial')
        .leftJoinAndSelect('material.sitio', 'sitio')
        .leftJoinAndSelect('material.registradoPor', 'registradoPor')
        .where('material.activo = :activo', { activo: true })
        .andWhere('material.esOriginal = :esOriginal', { esOriginal: false })
        .andWhere('material.requiereDevolucion = :requiereDevolucion', {
          requiereDevolucion: true,
        })
        .andWhere('material.sitioId IN (:...userSites)', { userSites })
        .andWhere('material.cantidadPrestada > 0')
        .orderBy('material.id', 'DESC')
        .skip(skip)
        .take(maxLimit);

      const materiales = await materialesQuery.getMany();

      // 🚀 CALCULAR SALDOS PENDIENTES POST-CONSULTA
      // ✅ CORREGIR: Definir tipo explícito del array
      const materialesConSaldo: (Material & {
        saldoPendiente: number;
        totalDevuelto: number;
      })[] = [];

      for (const material of materiales) {
        // ✅ CORREGIR: Validar que cantidadPrestada no sea undefined
        const cantidadPrestada = material.cantidadPrestada ?? 0;

        // Solo procesar si tiene cantidad prestada
        if (cantidadPrestada <= 0) {
          continue;
        }

        // Calcular total devuelto para este material
        const totalDevuelto = await this.movimientoRepo
          .createQueryBuilder('mov')
          .innerJoin('mov.tipoMovimiento', 'tipo')
          .select('COALESCE(SUM(mov.cantidad), 0)', 'total')
          .where('mov.materialId = :materialId', { materialId: material.id })
          .andWhere('tipo.nombre ILIKE :tipoNombre', {
            tipoNombre: '%devolucion%',
          })
          .andWhere('mov.estado = :estado', { estado: 'APROBADO' })
          .getRawOne();

        const devuelto = parseInt(totalDevuelto?.total || '0');
        const saldoPendiente = cantidadPrestada - devuelto;

        // Solo incluir si tiene saldo pendiente
        if (saldoPendiente > 0) {
          materialesConSaldo.push({
            ...material,
            saldoPendiente,
            totalDevuelto: devuelto,
          });
        }
      }

      // 🚀 CONTEO SIMPLIFICADO
      const totalQuery = this.repo
        .createQueryBuilder('material')
        .where('material.activo = :activo', { activo: true })
        .andWhere('material.esOriginal = :esOriginal', { esOriginal: false })
        .andWhere('material.requiereDevolucion = :requiereDevolucion', {
          requiereDevolucion: true,
        })
        .andWhere('material.sitioId IN (:...userSites)', { userSites })
        .andWhere('material.cantidadPrestada > 0');

      const totalMateriales = await totalQuery.getCount();

      return {
        message: 'Materiales prestados con saldo pendiente',
        data: materialesConSaldo,
        pagination: {
          page,
          limit: maxLimit,
          total: materialesConSaldo.length, // Total real después del filtrado
          totalMateriales, // Total de materiales prestados (antes del filtrado)
          totalPages: Math.ceil(materialesConSaldo.length / maxLimit),
        },
      };
    } catch (error) {
      console.error(
        'Error en findMaterialesPrestadosConSaldoPendiente:',
        error,
      );
      throw new BadRequestException(
        `Error al obtener materiales prestados: ${error.message}`,
      );
    }
  }

  // Método auxiliar para procesar devolución automática
  private async procesarDevolucionAutomatica(materialPrestado: Material) {
    if (
      !materialPrestado.materialOrigenId ||
      !materialPrestado.cantidadPrestada
    ) {
      return; // No hay nada que devolver
    }

    // 1. Encontrar el material origen
    const materialOrigen = await this.repo.findOne({
      where: { id: materialPrestado.materialOrigenId, activo: true },
    });

    if (!materialOrigen) {
      console.warn(
        `⚠️ Material origen no encontrado para ID: ${materialPrestado.materialOrigenId}`,
      );
      return;
    }

    // 2. Devolver stock al material de origen
    let stockOrigen = await this.stockRepo.findOne({
      where: { materialId: materialOrigen.id, activo: true },
    });

    if (stockOrigen) {
      // Si existe stock, agregar la cantidad devuelta
      stockOrigen.cantidad += materialPrestado.cantidadPrestada;
      await this.stockRepo.save(stockOrigen);
    } else {
      // Si no existe stock, crear uno nuevo
      const nuevoStock = this.stockRepo.create({
        materialId: materialOrigen.id,
        cantidad: materialPrestado.cantidadPrestada,
        activo: true,
        fechaCreacion: new Date(),
      });
      await this.stockRepo.save(nuevoStock);
    }

    // 3. Resetear cantidad prestada
    materialPrestado.cantidadPrestada = 0;
    materialPrestado.activo = false;
    await this.repo.save(materialPrestado);

    // 4. Desactivar stocks del material prestado
    await this.stockRepo.update(
      { materialId: materialPrestado.id },
      { activo: false, cantidad: 0 },
    );

    console.log(
      `✅ Devolución automática procesada: ${materialPrestado.nombre}`,
    );
  }
}

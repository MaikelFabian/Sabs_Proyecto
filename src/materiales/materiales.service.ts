
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Detalles } from '../detalles/entities/detalle.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sitio } from '../sitios/entities/sitio.entity'; // Agregar import
import { In, Repository } from 'typeorm';
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
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'stocks'],
      where: { activo: true }
    });
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles', 'sitio', 'registradoPor', 'stocks'],
    });
    return { message: 'Listado de materiales', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles', 'sitio', 'registradoPor', 'stocks'],
    });
    if (!encontrado) throw new NotFoundException(`Material no encontrado id: ${id}`);
    return { message: 'Material encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const { detalles, movimientos, tipoMaterial, unidadMedida, categoriaMaterial, registradoPor, stocks, ...updateData } = dto as any;
    
    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles', 'sitio', 'registradoPor', 'stocks'],
    });
    return { message: 'Material actualizado', data: actualizado };
  }

  async remove(id: number) {
    // 1. Verificar si el material existe
    const material = await this.repo.findOne({ 
      where: { id },
      relations: ['materialOrigen', 'stocks']
    });
    if (!material) {
      throw new NotFoundException(`Material no encontrado con ID: ${id}`);
    }

    console.log(`🗑️ Iniciando eliminación del material ID ${id}: ${material.nombre}`);

    try {
      // 2. Si es un material prestado, verificar si se puede eliminar
      if (material.materialOrigenId && (material.cantidadPrestada ?? 0) > 0) {
        throw new BadRequestException(
          `No se puede eliminar el material "${material.nombre}" porque es un préstamo activo. ` +
          `Debe procesarse la devolución primero.`
        );
      }

      // 3. Si es un material original con préstamos activos, verificar
      if (material.esOriginal) {
        const prestamosActivos = await this.repo.count({
          where: { 
            materialOrigenId: id,
            cantidadPrestada: { $gt: 0 } as any
          }
        });
        
        if (prestamosActivos > 0) {
          throw new BadRequestException(
            `No se puede eliminar el material "${material.nombre}" porque tiene ${prestamosActivos} préstamos activos. ` +
            `Debe procesarse la devolución de todos los préstamos primero.`
          );
        }
      }

      // 4. Eliminar registros de Stock asociados
      const stocksCount = await this.stockRepo.count({ where: { materialId: id } });
      console.log(`📊 Stocks encontrados: ${stocksCount}`);
      
      if (stocksCount > 0) {
        await this.stockRepo.delete({ materialId: id });
        console.log(`✅ Stocks eliminados: ${stocksCount} registros`);
      }

      // 5. Desvincular referencias en Detalles (preservar historial)
      const detallesCount = await this.detallesRepo.count({ where: { materialId: id } });
      console.log(`📊 Detalles encontrados que referencian el material: ${detallesCount}`);
      
      if (detallesCount > 0) {
        const updateResult = await this.detallesRepo.update(
          { materialId: id },
          { 
            activo: false // Marcar como inactivo para indicar que el material fue eliminado
          }
        );
        console.log(`✅ Detalles desvinculados: ${updateResult.affected} registros`);
      }

      // 6. Eliminar movimientos relacionados (tanto como material principal como préstamo)
      const movimientosCount = await this.movimientoRepo.count({ 
        where: [
          { materialId: id },
          { materialPrestamoId: id }
        ]
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
          movimientosEliminados: movimientosCount
        }
      };
      
    } catch (error) {
      console.error(`❌ Error al eliminar material ID ${id}:`, error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar material: ${error.message}`);
    }
  }

  // ✅ NUEVOS MÉTODOS para trabajar con Stock
  async getMaterialWithActiveStocks(id: number) {
    const material = await this.repo.findOne({
      where: { id },
      relations: ['stocks', 'tipoMaterial', 'unidadMedida', 'categoriaMaterial'],
    });
    if (!material) throw new NotFoundException(`Material no encontrado id: ${id}`);
    
    // Filtrar solo stocks activos
    const activeStocks = material.stocks?.filter(stock => stock.activo) || [];
    
    return {
      message: 'Material con stocks activos',
      data: { ...material, activeStocks }
    };
  }

  async getTotalActiveStock(materialId: number): Promise<number> {
    const material = await this.repo.findOne({
      where: { id: materialId },
      relations: ['stocks'],
    });
    if (!material) throw new NotFoundException(`Material no encontrado id: ${materialId}`);
    
    return material.stocks?.filter(stock => stock.activo)
      .reduce((total, stock) => total + stock.cantidad, 0) || 0;
  }

  // Nuevos métodos con filtrado por usuario
  async findByUserSite(userId: number) {
    // Obtener sitios del usuario desde su perfil/permisos
    const userSites = await this.getUserSites(userId);
    
    const lista = await this.repo.find({
      where: { 
        activo: true,
        sitioId: In(userSites) 
      },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles', 'sitio', 'registradoPor', 'stocks'],
    });
    return { message: 'Materiales del usuario', data: lista };
  }
  
  async findOneByUser(id: number, userId: number) {
    const userSites = await this.getUserSites(userId);
    
    const encontrado = await this.repo.findOne({
      where: { 
        id, 
        activo: true,
        sitioId: In(userSites)
      },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles', 'sitio', 'registradoPor', 'stocks'],
    });
    
    if (!encontrado) {
      throw new NotFoundException(`Material no encontrado o no tienes acceso a él`);
    }
    
    return { message: 'Material encontrado', data: encontrado };
  }
  
  async obtenerStockCompletoByUser(userId: number) {
    const userSites = await this.getUserSites(userId);
    
    return this.repo.find({
      select: ['id', 'nombre', 'descripcion', 'activo', 'fechaVencimiento'],
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'stocks'],
      where: { 
        activo: true,
        sitioId: In(userSites)
      }
    });
  }
  
  // Método auxiliar para obtener sitios del usuario (solución temporal)
  private async getUserSites(userId: number): Promise<number[]> {
    // SOLUCIÓN TEMPORAL: Retornar todos los sitios activos
    // TODO: Implementar lógica específica de usuario-sitio según requerimientos
    const sitiosActivos = await this.sitioRepo.find({
      where: { activo: true },
      select: ['id']
    });
    
    return sitiosActivos.map(sitio => sitio.id);
  }
  
  // Agregar después de la línea 259
  // 🚀 VERSIÓN OPTIMIZADA - Reemplaza el método existente
  async findMaterialesPrestadosConSaldoPendiente(userId: number, page: number = 1, limit: number = 50) {
    const userSites = await this.getUserSites(userId);
    const maxLimit = Math.min(limit, 100); // Máximo 100 registros
    const skip = (page - 1) * maxLimit;
  
    // 🚀 UNA SOLA CONSULTA OPTIMIZADA con paginación
    const query = this.repo
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.tipoMaterial', 'tipoMaterial')
      .leftJoinAndSelect('material.unidadMedida', 'unidadMedida')
      .leftJoinAndSelect('material.categoriaMaterial', 'categoriaMaterial')
      .leftJoinAndSelect('material.sitio', 'sitio')
      .leftJoinAndSelect('material.registradoPor', 'registradoPor')
      // 🚀 JOIN OPTIMIZADO para calcular saldo en una sola consulta
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('mov.materialId', '"materialId"') 
            .addSelect('COALESCE(SUM(mov.cantidad), 0)', 'totalDevuelto')
            .from(Movimiento, 'mov')
            .innerJoin('mov.tipoMovimiento', 'tipo')
            .where('tipo.nombre ILIKE :tipoNombre', { tipoNombre: '%devolucion%' })
            .andWhere('mov.estado = :estado', { estado: 'APROBADO' })
            .groupBy('mov.materialId');
        },
        'devoluciones',
        'devoluciones."materialId" = material.id'
      )
      .addSelect('COALESCE(devoluciones.totalDevuelto, 0)', 'totalDevuelto')
      .addSelect(
        'CASE WHEN material.cantidadPrestada > COALESCE(devoluciones.totalDevuelto, 0) THEN material.cantidadPrestada - COALESCE(devoluciones.totalDevuelto, 0) ELSE 0 END',
        'saldoPendiente'
      )
      .where('material.activo = :activo', { activo: true })
      .andWhere('material.esOriginal = :esOriginal', { esOriginal: false })
      .andWhere('material.requiereDevolucion = :requiereDevolucion', { requiereDevolucion: true })
      .andWhere('material.sitioId IN (:...userSites)', { userSites })
      .andWhere('material.cantidadPrestada > 0')
      // 🚀 FILTRAR solo materiales con saldo pendiente
      .having('saldoPendiente > 0')
      .orderBy('material.id', 'DESC')
      .skip(skip)
      .take(maxLimit);
  
    const [materialesRaw, total] = await Promise.all([
      query.getRawAndEntities(),
      query.getCount()
    ]);
  
    // 🚀 MAPEAR resultados eficientemente
    const materialesConSaldo = materialesRaw.entities.map((material, index) => {
      const rawData = materialesRaw.raw[index];
      return {
        ...material,
        saldoPendiente: parseInt(rawData.saldoPendiente) || 0,
        cantidadPrestada: parseInt(rawData.saldoPendiente) || material.cantidadPrestada
      };
    });
  
    return {
      message: 'Materiales prestados con saldo pendiente',
      data: materialesConSaldo,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit)
      }
    };
  }
  
  // 🗑️ ELIMINAR el método calcularSaldoPendiente (ya no se necesita)
  // private async calcularSaldoPendiente(materialPrestadoId: number): Promise<number> {
  //   // MÉTODO ELIMINADO - causaba consultas N+1
  // }
}

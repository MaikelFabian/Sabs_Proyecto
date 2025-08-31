import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity'; // Agregar import
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Sitio) // Agregar repositorio de Sitio
    private readonly sitioRepo: Repository<Sitio>,
  ) {}

  async create(dto: CreateStockDto) {
    // Verificar que el material existe
    const material = await this.materialRepository.findOne({
      where: { id: dto.materialId }
    });
    
    if (!material) {
      throw new NotFoundException(`Material con ID ${dto.materialId} no encontrado`);
    }
  
    // ✅ NUEVA LÓGICA: Sin límite de stock en Material
    // Los materiales ahora solo gestionan stock mediante entidades Stock
    // Removida validación de material.stock ya que no existe
  
    // Si requiere código pero no se proporciona, generar error
    if (dto.requiereCodigo && !dto.codigo) {
      throw new BadRequestException('Se requiere código para este tipo de stock');
    }
  
    // Verificar que el código no esté duplicado si se proporciona
    if (dto.codigo) {
      const existingStock = await this.stockRepository.findOne({
        where: { codigo: dto.codigo, materialId: dto.materialId }
      });
      
      if (existingStock) {
        throw new BadRequestException('Ya existe un stock con este código para el material');
      }
    }
  
    const stock = this.stockRepository.create({
      ...dto,
      activo: false // Siempre inicia inactivo
    });
  
    const savedStock = await this.stockRepository.save(stock);
    
    return {
      message: 'Stock creado exitosamente',
      data: await this.findOne(savedStock.id)
    };
  }

  // 🚀 OPTIMIZADO: findAll con paginación
  async findAll(page: number = 1, limit: number = 50) {
    const maxLimit = Math.min(limit, 100); // Máximo 100 registros
    const skip = (page - 1) * maxLimit;

    const [stocks, total] = await this.stockRepository.findAndCount({
      relations: ['material'],
      order: { fechaCreacion: 'DESC' },
      skip,
      take: maxLimit
    });

    return {
      message: 'Lista de stocks',
      data: stocks,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit)
      }
    };
  }

  // 🚀 OPTIMIZADO: findAllByUser con paginación
  async findAllByUser(userId: number, page: number = 1, limit: number = 50) {
    const maxLimit = Math.min(limit, 100);
    const skip = (page - 1) * maxLimit;
    const userSites = await this.getUserSites(userId);
    
    const [stocks, total] = await this.stockRepository.findAndCount({
      relations: ['material'],
      where: {
        material: {
          sitioId: In(userSites),
          activo: true
        }
      },
      order: { fechaCreacion: 'DESC' },
      skip,
      take: maxLimit
    });
  
    return {
      message: 'Lista de stocks del usuario',
      data: stocks,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit)
      }
    };
  }
  async findByMaterial(materialId: number) {
    const stocks = await this.stockRepository.find({
      where: { materialId },
      relations: ['material'],
      order: { fechaCreacion: 'DESC' }
    });

    return {
      message: `Stocks del material ${materialId}`,
      data: stocks
    };
  }

  async findOne(id: number) {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['material']
    });

    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`);
    }

    return {
      message: 'Stock encontrado',
      data: stock
    };
  }

  // 🔒 NUEVA VALIDACIÓN: Verificar si stock está en uso antes de editar
  private async verificarStockEnUso(stockId: number): Promise<boolean> {
    const stock = await this.stockRepository.findOne({
      where: { id: stockId },
      relations: ['material']
    });

    if (!stock) return false;

    // Si el material es un préstamo activo, no se puede editar el stock
    if (stock.material.materialOrigenId && (stock.material.cantidadPrestada ?? 0) > 0) {
      return true;
    }

    // Verificar si hay préstamos activos que usen este material
    const prestamosActivos = await this.materialRepository.count({
      where: {
        materialOrigenId: stock.materialId,
        activo: true,
        cantidadPrestada: { $gt: 0 } as any
      }
    });

    return prestamosActivos > 0;
  }

  // 🚀 OPTIMIZADO: update con validaciones de integridad
  async update(id: number, dto: UpdateStockDto) {
    const stock = await this.stockRepository.findOne({ 
      where: { id },
      relations: ['material']
    });
    
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`);
    }

    // 🔒 VALIDACIÓN CRÍTICA: Verificar si el stock está en uso
    const stockEnUso = await this.verificarStockEnUso(id);
    if (stockEnUso) {
      throw new BadRequestException(
        `No se puede editar el stock porque está siendo usado en préstamos activos. ` +
        `Debe procesarse la devolución primero.`
      );
    }

    // Si se está actualizando el código, verificar que no esté duplicado
    if (dto.codigo && dto.codigo !== stock.codigo) {
      const existingStock = await this.stockRepository.findOne({
        where: { codigo: dto.codigo, materialId: stock.materialId }
      });
      
      if (existingStock && existingStock.id !== id) {
        throw new BadRequestException('Ya existe un stock con este código para el material');
      }
    }

    await this.stockRepository.update(id, dto);
    
    return {
      message: 'Stock actualizado exitosamente',
      data: await this.findOne(id)
    };
  }

  // 🚀 OPTIMIZADO: remove con validaciones de integridad
  async remove(id: number) {
    const stock = await this.stockRepository.findOne({ 
      where: { id },
      relations: ['material']
    });
    
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`);
    }

    // 🔒 VALIDACIÓN CRÍTICA: Verificar si el stock está en uso
    const stockEnUso = await this.verificarStockEnUso(id);
    if (stockEnUso) {
      throw new BadRequestException(
        `No se puede eliminar el stock porque está siendo usado en préstamos activos. ` +
        `Debe procesarse la devolución primero.`
      );
    }

    await this.stockRepository.delete(id);
    
    return {
      message: 'Stock eliminado exitosamente'
    };
  }

  // Métodos para activar y desactivar stock
  async activar(id: number) {
    const stock = await this.stockRepository.findOne({ where: { id } });
    
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`);
    }

    stock.activo = true;
    await this.stockRepository.save(stock);
    
    return {
      message: 'Stock activado exitosamente',
      data: stock
    };
  }

  async desactivar(id: number) {
    const stock = await this.stockRepository.findOne({ where: { id } });
    
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`);
    }

    // Verificar si el stock está en uso antes de desactivar
    const stockEnUso = await this.verificarStockEnUso(id);
    if (stockEnUso) {
      throw new BadRequestException(
        `No se puede desactivar el stock porque está siendo usado en préstamos activos.`
      );
    }

    stock.activo = false;
    await this.stockRepository.save(stock);
    
    return {
      message: 'Stock desactivado exitosamente',
      data: stock
    };
  }

  // Nuevo método para obtener el total de stock activo por material
  async getTotalActiveStock(materialId: number) {
    // Verificar que el material existe
    const material = await this.materialRepository.findOne({
      where: { id: materialId }
    });
    
    if (!material) {
      throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
    }

    // Obtener todos los stocks activos del material
    const activeStocks = await this.stockRepository.find({
      where: { 
        materialId, 
        activo: true 
      }
    });

    // Calcular el total
    const total = activeStocks.reduce((sum, stock) => sum + stock.cantidad, 0);

    return {
      message: `Total de stock activo para material ${materialId}`,
      total
    };
  }

  // ELIMINAR ESTA FUNCIÓN DUPLICADA - mantener solo la versión con paginación
  // async findAllByUser(userId: number) { ... }
  
  async findByMaterialAndUser(materialId: number, userId: number) {
    const userSites = await this.getUserSites(userId);
    
    const stocks = await this.stockRepository.find({
      where: { 
        materialId,
        material: {
          sitioId: In(userSites),
          activo: true
        }
      },
      relations: ['material'],
      order: { fechaCreacion: 'DESC' }
    });
  
    return {
      message: `Stocks del material ${materialId} para el usuario`,
      data: stocks
    };
  }
  
  async findOneByUser(id: number, userId: number) {
    const userSites = await this.getUserSites(userId);
    
    const stock = await this.stockRepository.findOne({
      where: { 
        id,
        material: {
          sitioId: In(userSites),
          activo: true
        }
      },
      relations: ['material']
    });
  
    if (!stock) {
      throw new NotFoundException(`Stock no encontrado o no tienes acceso a él`);
    }
  
    return {
      message: 'Stock encontrado',
      data: stock
    };
  }
  
  // Método auxiliar para obtener sitios del usuario
  private async getUserSites(userId: number): Promise<number[]> {
    // SOLUCIÓN TEMPORAL: Retornar todos los sitios activos
    const sitiosActivos = await this.sitioRepo.find({
      where: { activo: true },
      select: ['id']
    });
    
    return sitiosActivos.map(sitio => sitio.id);
  }
}
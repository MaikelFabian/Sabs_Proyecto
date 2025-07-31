import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { FiltrarMovimientosDto } from './dto/filtrar-movimientos.dto';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from '../tipo-movimiento/entities/tipo-movimiento.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Detalles)
    private readonly detallesRepository: Repository<Detalles>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateMovimientoDto) {
    return await this.dataSource.transaction(async (manager) => {
      console.log('🚀 Iniciando creación de movimiento con transacción');
      console.log('📝 DTO recibido:', JSON.stringify(dto, null, 2));

      // 1. Validar material
      const material = await manager.findOne(Material, {
        where: { id: dto.materialId }
      });
      if (!material) {
        throw new BadRequestException(`Material con ID ${dto.materialId} no encontrado`);
      }
      console.log('✅ Material encontrado:', material.nombre);

      const tipoMovimiento = await manager.findOne(TipoMovimiento, {
        where: { id: dto.tipoMovimientoId }
      });
      if (!tipoMovimiento) {
        throw new BadRequestException(`Tipo de movimiento con ID ${dto.tipoMovimientoId} no encontrado`);
      }


      let solicitud: Solicitud;

      if (dto.solicitudId) {
        // Fix: Handle potential null return
        const foundSolicitud = await manager.findOne(Solicitud, {
          where: { id: dto.solicitudId }
        });
        if (!foundSolicitud) {
          throw new BadRequestException(`Solicitud con ID ${dto.solicitudId} no encontrada`);
        }
        if (foundSolicitud.estado !== 'PENDIENTE') {
          throw new BadRequestException(`La solicitud debe estar en estado PENDIENTE. Estado actual: ${foundSolicitud.estado}`);
        }
        solicitud = foundSolicitud;
      } else {
        // Fix: Use correct property name 'solicitante' instead of 'solicitanteId'
        solicitud = manager.create(Solicitud, {
          descripcion: dto.descripcion || `Solicitud automática: ${tipoMovimiento.nombre} - ${material.nombre}`,
          estado: 'PENDIENTE',
          solicitante: { id: dto.personaId } as any, // Reference to Persona entity
          fechaCreacion: new Date(),
        });
        solicitud = await manager.save(Solicitud, solicitud);
      }

      // 4. Crear el detalle PRIMERO
      const detalle = manager.create(Detalles, {
        cantidad: dto.cantidad,
        materialId: dto.materialId,
        estado: 'PENDIENTE',
        solicitudId: solicitud.id,
        fechaCreacion: new Date(),
      });
      const detalleGuardado = await manager.save(Detalles, detalle);
      console.log(' Detalle creado:', detalleGuardado.id);


      const movimiento = manager.create(Movimiento, {
        cantidad: dto.cantidad,
        descripcion: dto.descripcion,
        materialId: dto.materialId,
        tipoMovimientoId: dto.tipoMovimientoId,
        personaId: dto.personaId,
        solicitudId: solicitud.id,
        detalleId: detalleGuardado.id, 
        fechaCreacion: new Date(),
      });
      const movimientoGuardado = await manager.save(Movimiento, movimiento);
      console.log(' Movimiento creado:', movimientoGuardado.id);

      console.log('     Transacción completada exitosamente');
      console.log('     Resumen:');
      console.log(`   - Solicitud: ${solicitud.id} (${solicitud.estado})`);
      console.log(`   - Movimiento: ${movimientoGuardado.id}`);
      console.log(`   - Detalle: ${detalleGuardado.id} (${detalleGuardado.estado})`);

      return {
        message: 'Movimiento, solicitud y detalle creados exitosamente. El detalle está pendiente de aprobación.',
        data: {
          movimiento: movimientoGuardado,
          detalle: detalleGuardado,
          solicitud: solicitud,
        },
      };
    });
  }

  async filtrarMovimientos(dto: FiltrarMovimientosDto) {
    const {
      materialId,
      tipoMovimientoId,
      personaId,
      fechaInicio,
      fechaFin,
      page = 1,
      limit = 10,
    } = dto;

    const query = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.material', 'material')
      .leftJoinAndSelect('movimiento.tipoMovimiento', 'tipoMovimiento')
      .leftJoinAndSelect('movimiento.persona', 'persona')
      .leftJoinAndSelect('movimiento.solicitud', 'solicitud')
      .leftJoinAndSelect('movimiento.detalle', 'detalle')
      .orderBy('movimiento.fechaCreacion', 'DESC');

    if (materialId) {
      query.andWhere('movimiento.materialId = :materialId', { materialId });
    }

    if (tipoMovimientoId) {
      query.andWhere('movimiento.tipoMovimientoId = :tipoMovimientoId', {
        tipoMovimientoId,
      });
    }

    if (personaId) {
      query.andWhere('movimiento.personaId = :personaId', { personaId });
    }

    if (fechaInicio) {
      query.andWhere('movimiento.fechaCreacion >= :fechaInicio', { fechaInicio });
    }

    if (fechaFin) {
      query.andWhere('movimiento.fechaCreacion <= :fechaFin', { fechaFin });
    }

    // Paginación
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      message: 'Movimientos filtrados',
      data,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      }
    };
  }

  async findAll() {
    const movimientos = await this.movimientoRepository.find({
      relations: {
        material: true,
        tipoMovimiento: true,
        persona: true,
        solicitud: true,
        detalle: true
      },
      order: { fechaCreacion: 'DESC' },
    });

    return {
      message: 'Lista de movimientos',
      data: movimientos
    };
  }

  async findOne(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: {
        material: true,
        tipoMovimiento: true,
        persona: true,
        solicitud: true,
        detalle: true
      },
    });
    
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    
    return {
      message: 'Movimiento encontrado',
      data: movimiento
    };
  }

  async findMovimientoConDetalle(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: {
        detalle: true,
        solicitud: true,
        material: true,
        tipoMovimiento: true,
        persona: true
      }
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    return {
      message: 'Movimiento con detalle encontrado',
      data: movimiento
    };
  }

  async findMovimientosPendientes() {
    const movimientos = await this.movimientoRepository.find({
      where: {
        detalle: {
          estado: 'PENDIENTE'
        }
      },
      relations: {
        material: true,
        tipoMovimiento: true,
        persona: true,
        solicitud: true,
        detalle: true
      },
      order: { fechaCreacion: 'DESC' },
    });

    return {
      message: 'Movimientos pendientes de aprobación',
      data: movimientos
    };
  }

  async update(id: number, dto: UpdateMovimientoDto) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['detalle']
    });
    
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    // Verificar que el movimiento no esté aprobado
    if (movimiento.detalle?.estado === 'APROBADO') {
      throw new BadRequestException('No se puede modificar un movimiento aprobado');
    }

    await this.movimientoRepository.update(id, dto);
    
    const actualizado = await this.movimientoRepository.findOne({
      where: { id },
      relations: {
        material: true,
        tipoMovimiento: true,
        persona: true,
        solicitud: true,
        detalle: true
      },
    });
    
    return {
      message: 'Movimiento actualizado',
      data: actualizado
    };
  }

  async remove(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['detalle']
    });
    
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    // Verificar que el movimiento no esté aprobado
    if (movimiento.detalle?.estado === 'APROBADO') {
      throw new BadRequestException('No se puede eliminar un movimiento aprobado');
    }

    return await this.dataSource.transaction(async (manager) => {
      // Eliminar el detalle asociado primero
      if (movimiento.detalleId) {
        await manager.delete(Detalles, { id: movimiento.detalleId });
      }
      
      // Eliminar el movimiento
      await manager.delete(Movimiento, { id });
      
      return { message: 'Movimiento y detalle eliminados correctamente' };
    });
  }

  async crearDesdeSolicitud(params: {
    materialId: number;
    cantidad: number;
    personaId: number;
    tipoMovimientoNombre: string;
    solicitudId?: number;
    descripcion?: string;
  }) {
    const {
      materialId,
      cantidad,
      personaId,
      tipoMovimientoNombre,
      solicitudId,
      descripcion
    } = params;

    const tipoMovimiento = await this.tipoMovimientoRepository.findOne({
      where: { nombre: tipoMovimientoNombre },
    });

    if (!tipoMovimiento) {
      throw new BadRequestException(
        `Tipo de movimiento '${tipoMovimientoNombre}' no encontrado`,
      );
    }

    return this.create({
      materialId,
      cantidad,
      personaId,
      tipoMovimientoId: tipoMovimiento.id,
      solicitudId,
      descripcion,
    });
  }
}
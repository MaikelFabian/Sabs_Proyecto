import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { Persona } from 'src/personas/entities/persona.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    @InjectRepository(Detalles)
    private readonly detallesRepo: Repository<Detalles>,
    private readonly dataSource: DataSource,
  ) {}

  // Crear solicitud independiente
  async create(dto: CreateSolicitudDto) {
    const solicitante = await this.personaRepo.findOne({
      where: { id: dto.personaId },
    });
    if (!solicitante)
      throw new NotFoundException('Persona solicitante no encontrada');

    const solicitud = this.solicitudRepo.create({
      descripcion: dto.descripcion,
      solicitante,
      estado: dto.estado || 'PENDIENTE',
    });

    return await this.solicitudRepo.save(solicitud);
  }

  async createInternal(dto: CreateSolicitudDto) {
    const solicitante = await this.personaRepo.findOne({
      where: { id: dto.personaId },
    });
    if (!solicitante)
      throw new NotFoundException('Persona solicitante no encontrada');

    const solicitud = this.solicitudRepo.create({
      descripcion: dto.descripcion,
      solicitante,
      estado: dto.estado || 'PENDIENTE',
    });

    return await this.solicitudRepo.save(solicitud);
  }

  async findAll() {
    return await this.solicitudRepo.find({
      relations: ['solicitante', 'movimientos', 'detalles'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: [
        'solicitante',
        'movimientos',
        'movimientos.material',
        'movimientos.tipoMovimiento',
        'detalles',
        'detalles.personaAprueba',
      ],
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    return solicitud;
  }

  async getResumenSolicitud(id: number) {
    const solicitud = await this.findOne(id);
    
    return {
      solicitud: {
        id: solicitud.id,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        fechaCreacion: solicitud.fechaCreacion,
        solicitante: {
          id: solicitud.solicitante,
          nombre: solicitud.solicitante.nombre,
        },
      },
      movimientos: solicitud.movimientos.map(mov => ({
        id: mov.id,
        cantidad: mov.cantidad,
        material: {
          id: mov.material.id,
          nombre: mov.material.nombre,
          codigo: mov.material.codigo,
        },
        tipoMovimiento: mov.tipoMovimiento?.nombre,
        fechaCreacion: mov.fechaCreacion,
      })),
      detalles: solicitud.detalles.map(det => ({
        id: det.id,
        estado: det.estado,
        personaAprueba: det.personaAprueba ? {
          id: det.personaAprueba.id,
          nombre: det.personaAprueba.nombre,
        } : null,
        fechaCreacion: det.fechaCreacion,
      })),
    };
  }


  async updateEstado(id: number, estado: string) {
    const solicitud = await this.solicitudRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    solicitud.estado = estado as any;
    return await this.solicitudRepo.save(solicitud);
  }

  async remove(id: number) {
    // 1. Verificar que la solicitud existe
    const solicitud = await this.solicitudRepo.findOne({ 
      where: { id },
      relations: ['movimientos', 'detalles']
    });
    
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }
  
    // 2. Verificar si tiene movimientos o detalles asociados
    if (solicitud.movimientos && solicitud.movimientos.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la solicitud porque tiene ${solicitud.movimientos.length} movimiento(s) asociado(s). ` +
        'Elimine primero los movimientos relacionados.'
      );
    }
  
    if (solicitud.detalles && solicitud.detalles.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la solicitud porque tiene ${solicitud.detalles.length} detalle(s) asociado(s). ` +
        'Elimine primero los detalles relacionados.'
      );
    }
  
    // 3. Si no hay elementos asociados, proceder con la eliminación
    const result = await this.solicitudRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }
    
    return { message: 'Solicitud eliminada exitosamente' };
  }
}
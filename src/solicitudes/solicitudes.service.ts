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

  async aprobar(id: number, aprobadorId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const solicitud = await queryRunner.manager.findOne(Solicitud, {
        where: { id },
        relations: ['solicitante', 'detalles']
      });

      if (!solicitud) {
        throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
      }

      if (solicitud.estado !== 'PENDIENTE') {
        throw new BadRequestException(`Solo se pueden aprobar solicitudes en estado PENDIENTE`);
      }

      const aprobador = await queryRunner.manager.findOne(Persona, {
        where: { id: aprobadorId }
      });

      if (!aprobador) {
        throw new NotFoundException(`Persona aprobadora con ID ${aprobadorId} no encontrada`);
      }

      solicitud.estado = 'APROBADA';
      solicitud.aprobador = aprobador;
      
      const solicitudActualizada = await queryRunner.manager.save(solicitud);
      
      // Aprobar automáticamente todos los detalles asociados
      if (solicitud.detalles && solicitud.detalles.length > 0) {
        await queryRunner.manager.update(
          Detalles,
          { solicitudId: id },
          { 
            estado: 'APROBADO',
            personaApruebaId: aprobadorId
          }
        );
      }

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async entregar(id: number, encargadoId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const solicitud = await queryRunner.manager.findOne(Solicitud, {
        where: { id },
        relations: ['detalles']
      });

      if (!solicitud) {
        throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
      }

      if (solicitud.estado !== 'APROBADA') {
        throw new BadRequestException(`Solo se pueden entregar solicitudes APROBADAS`);
      }

      const encargado = await queryRunner.manager.findOne(Persona, {
        where: { id: encargadoId }
      });

      if (!encargado) {
        throw new NotFoundException(`Persona encargada con ID ${encargadoId} no encontrada`);
      }

      solicitud.estado = 'ENTREGADA';
      solicitud.encargadoEntrega = encargado;
      
      const solicitudActualizada = await queryRunner.manager.save(solicitud);
      
      // Marcar detalles como entregados
      // Cambiar 'ENTREGADO' por 'PRESTADO'
      if (solicitud.detalles && solicitud.detalles.length > 0) {
        await queryRunner.manager.update(
          Detalles,
          { solicitudId: id },
          { estado: 'PRESTADO' } // Cambiar de 'ENTREGADO' a 'PRESTADO'
        );
      }

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async devolver(id: number, encargadoId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const solicitud = await queryRunner.manager.findOne(Solicitud, {
        where: { id },
        relations: ['detalles']
      });

      if (!solicitud) {
        throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
      }

      if (solicitud.estado !== 'ENTREGADA') {
        throw new BadRequestException(`Solo se pueden devolver solicitudes ENTREGADAS`);
      }

      const encargado = await queryRunner.manager.findOne(Persona, {
        where: { id: encargadoId }
      });

      if (!encargado) {
        throw new NotFoundException(`Persona encargada con ID ${encargadoId} no encontrada`);
      }

      solicitud.estado = 'DEVUELTA';
      solicitud.encargadoEntrega = encargado;
      
      const solicitudActualizada = await queryRunner.manager.save(solicitud);
      
      // Marcar detalles como devueltos
      if (solicitud.detalles && solicitud.detalles.length > 0) {
        await queryRunner.manager.update(
          Detalles,
          { solicitudId: id },
          { estado: 'DEVUELTO' }
        );
      }

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rechazar(id: number, aprobadorId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const solicitud = await queryRunner.manager.findOne(Solicitud, {
        where: { id },
        relations: ['detalles']
      });

      if (!solicitud) {
        throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
      }

      if (solicitud.estado !== 'PENDIENTE') {
        throw new BadRequestException(`Solo se pueden rechazar solicitudes en estado PENDIENTE`);
      }

      const aprobador = await queryRunner.manager.findOne(Persona, {
        where: { id: aprobadorId }
      });

      if (!aprobador) {
        throw new NotFoundException(`Persona aprobadora con ID ${aprobadorId} no encontrada`);
      }

      solicitud.estado = 'RECHAZADA';
      solicitud.aprobador = aprobador;
      
      const solicitudActualizada = await queryRunner.manager.save(solicitud);
      
      // Rechazar automáticamente todos los detalles asociados
      if (solicitud.detalles && solicitud.detalles.length > 0) {
        await queryRunner.manager.update(
          Detalles,
          { solicitudId: id },
          { 
            estado: 'RECHAZADO',
            personaApruebaId: aprobadorId
          }
        );
      }

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
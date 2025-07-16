import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly detalleRepo: Repository<Detalles>,
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,

    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,

    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
  ) {}

  async create(dto: CreateSolicitudDto) {
    const solicitud = this.solicitudRepo.create({
      descripcion: dto.descripcion,
      personaId: dto.personaId,
      estado: 'PENDIENTE',
    });

    await this.solicitudRepo.save(solicitud);
    const detalles = dto.detalles.map((d) =>
      this.detalleRepo.create({
        cantidad: d.cantidad,
        materialId: d.materialId,
        solicitudId: solicitud.id,
      }),
    );
    await this.detalleRepo.save(detalles);

    return this.solicitudRepo.findOne({
      where: { id: solicitud.id },
      relations: ['persona', 'detalles', 'detalles.material'],
    });
  }

  async aprobarSolicitud(id: number, personaApruebaId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    solicitud.estado = 'APROBADA';
    solicitud.personaApruebaId = personaApruebaId;
    solicitud.fechaActualizacion = new Date();
    return this.solicitudRepo.save(solicitud);
  }

  async entregarSolicitud(id: number, personaEncargadaId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    solicitud.estado = 'ENTREGADA';
    solicitud.personaEncargadaId = personaEncargadaId;
    solicitud.fechaActualizacion = new Date();

    // Descontar stock
    for (const detalle of solicitud.detalles) {
      const material = await this.materialRepository.findOne({
        where: { id: detalle.materialId },
      });
      if (material) {
        material.stock -= detalle.cantidadSolicitada;
        await this.materialRepository.save(material);

        // Registrar movimiento de salida
        const movimiento = this.movimientoRepository.create({
          cantidad: detalle.cantidadSolicitada,
          materialId: detalle.materialId,
          tipoMovimientoId: 2, // Salida
        });
        await this.movimientoRepository.save(movimiento);
      }
    }

    return this.solicitudRepo.save(solicitud);
  }

  async autorizarSolicitud(
    id: number,
    personaApruebaId: number,
    aprobar: boolean,
  ) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    solicitud.aprobada = aprobar;
    solicitud.personaApruebaId = personaApruebaId;

    if (aprobar) {
      for (const detalle of solicitud.detalles) {
        const material = await this.materialRepository.findOne({
          where: { id: detalle.materialId },
        });
        if (!material) throw new NotFoundException('Material no encontrado');

        if (material.stock < detalle.cantidadSolicitada) {
          throw new BadRequestException(
            `Stock insuficiente para el material ${material.nombre}`,
          );
        }

        material.stock -= detalle.cantidadSolicitada;
        await this.materialRepository.save(material);

        const movimiento = this.movimientoRepository.create({
          tipoMovimientoId: 2, // salida
          materialId: material.id,
          cantidad: detalle.cantidadSolicitada,
        });
        await this.movimientoRepository.save(movimiento);
      }
    }

    return this.solicitudRepo.save(solicitud);
  }

  async filtrarPorEstado(aprobada: boolean) {
    return this.solicitudRepo.find({
      where: { aprobada },
      relations: ['detalles', 'detalles.material'],
    });
  }

  findAll() {
    return this.solicitudRepo.find({
      relations: ['persona', 'detalles', 'detalles.material'],
    });
  }

  findOne(id: number) {
    return this.solicitudRepo.findOne({
      where: { id },
      relations: ['persona', 'detalles', 'detalles.material'],
    });
  }

  async update(id: number, dto: any) {
    const solicitud = await this.solicitudRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con id ${id} no encontrada`);
    }

    // Actualiza solo campos que existen en la entidad y que sean seguros
    if (dto.estado !== undefined) {
      solicitud.estado = dto.estado;
    }
    if (dto.aprobada !== undefined) {
      solicitud.aprobada = dto.aprobada;
    }
    if (dto.descripcion !== undefined) {
      solicitud.descripcion = dto.descripcion;
    }
    if (dto.personaId !== undefined) {
      solicitud.personaId = dto.personaId;
    }
    // 👇 NO actualices detalles aquí

    return this.solicitudRepo.save(solicitud);
  }

  remove(id: number) {
    return this.solicitudRepo.delete(id);
  }
}

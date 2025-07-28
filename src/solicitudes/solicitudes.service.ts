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
import { Persona } from 'src/personas/entities/persona.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,

    @InjectRepository(Detalles)
    private readonly detalleRepo: Repository<Detalles>,

    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,

    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,

    @InjectRepository(Persona)
    private readonly personaRepo: Repository<Persona>,

    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepo: Repository<TipoMovimiento>,
  ) {}

  async create(dto: CreateSolicitudDto) {
    const solicitante = await this.personaRepo.findOne({
      where: { id: dto.personaId },
    });
    if (!solicitante)
      throw new NotFoundException('Persona solicitante no encontrada');

    const solicitud = this.solicitudRepo.create({
      descripcion: dto.descripcion,
      solicitante,
      estado: 'PENDIENTE',
    });

    await this.solicitudRepo.save(solicitud);

    const detalles = dto.detalles.map((d) =>
      this.detalleRepo.create({
        cantidad: d.cantidad,
        material: { id: d.materialId },
        solicitud,
        personaSolicita: solicitante,
      }),
    );

    await this.detalleRepo.save(detalles);

    return this.solicitudRepo.findOne({
      where: { id: solicitud.id },
      relations: ['solicitante', 'detalles', 'detalles.material'],
    });
  }

  async aprobarSolicitud(id: number, aprobadorId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles', 'detalles.material'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    const aprobador = await this.personaRepo.findOne({
      where: { id: aprobadorId },
    });
    if (!aprobador) throw new NotFoundException('Aprobador no encontrado');

    // Verificar stock disponible
    for (const detalle of solicitud.detalles) {
      if (detalle.material.stock < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${detalle.material.nombre}`,
        );
      }
    }

    // Obtener tipo de movimiento SALIDA
    const tipoMovimientoSalida = await this.tipoMovimientoRepo.findOne({
      where: { nombre: 'SALIDA' },
    });
    if (!tipoMovimientoSalida) {
      throw new NotFoundException('Tipo de movimiento SALIDA no encontrado');
    }

    // Descontar stock y crear movimientos
    for (const detalle of solicitud.detalles) {
      // Descontar stock del material
      detalle.material.stock -= detalle.cantidad;
      await this.materialRepo.save(detalle.material);

      // Crear el movimiento asociado
      const movimiento = this.movimientoRepo.create({
        tipoMovimiento: tipoMovimientoSalida,
        persona: aprobador,
        cantidad: detalle.cantidad,
        material: detalle.material,
        solicitud,
      });
      await this.movimientoRepo.save(movimiento);
    }

    // Actualizar estado de solicitud y aprobador
    solicitud.estado = 'APROBADA';
    solicitud.aprobador = aprobador;
    solicitud.fechaActualizacion = new Date();

    return this.solicitudRepo.save(solicitud);
  }

  async rechazarSolicitud(id: number, aprobadorId: number) {
    const solicitud = await this.solicitudRepo.findOne({ where: { id } });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    const aprobador = await this.personaRepo.findOne({
      where: { id: aprobadorId },
    });
    if (!aprobador) throw new NotFoundException('Aprobador no encontrado');

    solicitud.estado = 'RECHAZADA';
    solicitud.aprobador = aprobador;
    solicitud.fechaActualizacion = new Date();

    return this.solicitudRepo.save(solicitud);
  }

  async entregarSolicitud(id: number, encargadoId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles', 'detalles.material'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (solicitud.estado !== 'APROBADA') {
      throw new BadRequestException(
        'Solo se pueden entregar solicitudes aprobadas',
      );
    }

    const encargado = await this.personaRepo.findOne({
      where: { id: encargadoId },
    });
    if (!encargado) throw new NotFoundException('Encargado no encontrado');

    const tipoSalida = await this.tipoMovimientoRepo.findOne({
      where: { nombre: 'SALIDA' },
    });
    if (!tipoSalida)
      throw new NotFoundException('Tipo de movimiento SALIDA no existe');

    for (const detalle of solicitud.detalles) {
      // Validar stock
      if (detalle.material.stock < detalle.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${detalle.material.nombre}`,
        );
      }

      // Descontar stock
      detalle.material.stock -= detalle.cantidad;
      await this.materialRepo.save(detalle.material);

      // Crear movimiento
      const movimiento = this.movimientoRepo.create({
        persona: encargado,
        tipoMovimiento: tipoSalida,
        material: detalle.material,
        cantidad: detalle.cantidad,
        solicitud,
      });

      await this.movimientoRepo.save(movimiento);
    }

    solicitud.estado = 'ENTREGADA';
    solicitud.encargadoEntrega = encargado;
    solicitud.fechaActualizacion = new Date();

    return this.solicitudRepo.save(solicitud);
  }

  findAll() {
    return this.solicitudRepo.find({
      relations: [
        'solicitante',
        'aprobador',
        'encargadoEntrega',
        'detalles',
        'detalles.material',
        'movimientos', // Agregado
        'movimientos.material',
        'movimientos.tipoMovimiento',
        'movimientos.persona',
      ],
    });
  }

  findOne(id: number) {
    return this.solicitudRepo.findOne({
      where: { id },
      relations: [
        'solicitante',
        'aprobador',
        'encargadoEntrega',
        'detalles',
        'detalles.material',
        'movimientos',
        'movimientos.material',
        'movimientos.tipoMovimiento',
        'movimientos.persona',
      ],
    });
  }

  async update(id: number, dto: Partial<CreateSolicitudDto>) {
    const solicitud = await this.solicitudRepo.findOne({ where: { id } });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud con id ${id} no encontrada`);
    }

    if (dto.estado) solicitud.estado = dto.estado;
    if (dto.descripcion) solicitud.descripcion = dto.descripcion;

    return this.solicitudRepo.save(solicitud);
  }

  remove(id: number) {
    return this.solicitudRepo.delete(id);
  }

  async getMovimientosPorSolicitud(solicitudId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id: solicitudId },
    });
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const movimientos = await this.movimientoRepo.find({
      where: { solicitud: { id: solicitudId } },
      relations: ['tipoMovimiento', 'persona', 'material'],
      order: { fechaCreacion: 'ASC' },
    });

    return movimientos.map((mov) => ({
      id: mov.id,
      tipo: mov.tipoMovimiento?.nombre,
      material: mov.material.nombre,
      cantidad: mov.cantidad,
      persona: mov.persona?.nombre,
      fecha: mov.fechaCreacion,
    }));
  }
  async devolverSolicitud(id: number, encargadoId: number) {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['detalles', 'detalles.material'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (solicitud.estado !== 'ENTREGADA') {
      throw new BadRequestException(
        'Solo se pueden devolver solicitudes entregadas',
      );
    }

    const encargado = await this.personaRepo.findOne({
      where: { id: encargadoId },
    });
    if (!encargado) throw new NotFoundException('Encargado no encontrado');

    const tipoEntrada = await this.tipoMovimientoRepo.findOne({
      where: { nombre: 'ENTRADA' },
    });
    if (!tipoEntrada)
      throw new NotFoundException('Tipo de movimiento ENTRADA no existe');

    for (const detalle of solicitud.detalles) {
      // Aumentar stock
      detalle.material.stock += detalle.cantidad;
      await this.materialRepo.save(detalle.material);

      // Registrar movimiento
      const movimiento = this.movimientoRepo.create({
        persona: encargado,
        tipoMovimiento: tipoEntrada,
        material: detalle.material,
        cantidad: detalle.cantidad,
        solicitud,
      });

      await this.movimientoRepo.save(movimiento);
    }

    solicitud.estado = 'DEVUELTA';
    solicitud.fechaActualizacion = new Date();

    return this.solicitudRepo.save(solicitud);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { Repository } from 'typeorm';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from '../tipo-movimiento/entities/tipo-movimiento.entity';
import { FiltrarMovimientosDto } from './dto/filtrar-movimientos.dto';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepository: Repository<TipoMovimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto) {
    const { materialId, tipoMovimientoId, cantidad } = createMovimientoDto;

    const material = await this.materialRepository.findOne({
      where: { id: materialId },
    });
    if (!material) throw new BadRequestException('Material no encontrado');

    const tipoMovimiento = await this.tipoMovimientoRepository.findOne({
      where: { id: tipoMovimientoId },
    });
    if (!tipoMovimiento)
      throw new BadRequestException('Tipo de movimiento no encontrado');

    let nuevoStock = material.stock;
    if (tipoMovimiento.nombre.toLowerCase() === 'entrada') {
      nuevoStock += cantidad;
    } else if (tipoMovimiento.nombre.toLowerCase() === 'salida') {
      if (material.stock < cantidad) {
        throw new BadRequestException('Stock insuficiente para salida');
      }
      nuevoStock -= cantidad;
    } else {
      throw new BadRequestException('Tipo de movimiento desconocido');
    }

    material.stock = nuevoStock;
    await this.materialRepository.save(material);

    const movimiento = this.movimientoRepository.create({
      ...createMovimientoDto,
      material,
      tipoMovimiento,
    });

    return this.movimientoRepository.save(movimiento);
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
      .orderBy('movimiento.fecha', 'DESC');

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
      query.andWhere('movimiento.fecha >= :fechaInicio', { fechaInicio });
    }

    if (fechaFin) {
      query.andWhere('movimiento.fecha <= :fechaFin', { fechaFin });
    }

    // paginación
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAll() {
    return this.movimientoRepository.find({
      relations: ['material', 'tipoMovimiento'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['material', 'tipoMovimiento'],
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  async update(id: number, dto: UpdateMovimientoDto) {
    await this.movimientoRepository.update(id, dto);
    const actualizado = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['material', 'tipoMovimiento'],
    });
    if (!actualizado) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return actualizado;
  }

  async remove(id: number) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
    });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    await this.movimientoRepository.delete(id);
    return { message: 'Movimiento eliminado correctamente' };
  }
}

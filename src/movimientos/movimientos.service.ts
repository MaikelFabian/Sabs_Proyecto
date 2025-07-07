// src/movimiento/movimiento.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly repo: Repository<Movimiento>,
  ) {}

  async create(dto: CreateMovimientoDto) {
    const nuevo = this.repo.create({
      tipoMovimiento: dto.tipoMovimientoId ? { id: dto.tipoMovimientoId } : undefined,
      persona: dto.personaId ? { id: dto.personaId } : undefined,
      activo: dto.activo,
      fechaCreacion: dto.fechaCreacion,
      fechaActualizacion: dto.fechaActualizacion,
    });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Movimiento creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['tipoMovimiento', 'persona'] });
    return { message: 'Listado de movimientos', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({ where: { id }, relations: ['tipoMovimiento', 'persona'] });
    if (!encontrado) throw new NotFoundException(`Movimiento no encontrado id: ${id}`);
    return { message: 'Movimiento encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateMovimientoDto) {
    await this.repo.update(id, {
      tipoMovimiento: dto.tipoMovimientoId ? { id: dto.tipoMovimientoId } : undefined,
      persona: dto.personaId ? { id: dto.personaId } : undefined,
      activo: dto.activo,
      fechaCreacion: dto.fechaCreacion,
      fechaActualizacion: dto.fechaActualizacion,
    });
    const actualizado = await this.repo.findOne({ where: { id }, relations: ['tipoMovimiento', 'persona'] });
    return { message: 'Movimiento actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Movimiento eliminado' };
  }
}

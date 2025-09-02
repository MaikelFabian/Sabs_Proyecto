// src/detalles/detalles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detalle } from './entities/detalle.entity';

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalle)
    private readonly detalleRepo: Repository<Detalle>,
  ) {}

  async create(dto: {
    movimientoId: number;
    materialId: number;
    cantidad: number;
    personaSolicitaId?: number;
  }) {
    const detalle = this.detalleRepo.create({
      movimientoId: dto.movimientoId,
      materialId: dto.materialId,
      cantidad: dto.cantidad,
      personaSolicitaId: dto.personaSolicitaId ?? null,
      estado: 'pendiente',
    });
    return this.detalleRepo.save(detalle);
  }

  async findAll() {
    return this.detalleRepo.find({
      relations: ['movimiento', 'material', 'personaSolicita', 'personaAprueba'],
    });
  }

  async findOne(id: number) {
    const detalle = await this.detalleRepo.findOne({
      where: { id },
      relations: ['movimiento', 'material', 'personaSolicita', 'personaAprueba'],
    });
    if (!detalle) {
      throw new NotFoundException(`Detalle con id ${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: number, updateDto: Partial<Detalle>) {
    const detalle = await this.findOne(id);
    Object.assign(detalle, updateDto);
    return this.detalleRepo.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    return this.detalleRepo.remove(detalle);
  }
}

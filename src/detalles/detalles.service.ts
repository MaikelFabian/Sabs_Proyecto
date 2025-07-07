// src/detalles/detalles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Detalles } from './entities/detalle.entity';
import { Repository } from 'typeorm';
import { CreateDetallesDto } from './dto/create-detalle.dto';
import { UpdateDetallesDto } from './dto/update-detalle.dto';

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly repo: Repository<Detalles>,
  ) {}

  async create(dto: CreateDetallesDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Detalle creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: [
        'material',
        'personaEncargada',
        'personaSolicita',
        'personaAprueba',
      ],
    });
    return { message: 'Listado de detalles', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: [
        'material',
        'personaEncargada',
        'personaSolicita',
        'personaAprueba',
      ],
    });
    if (!encontrado)
      throw new NotFoundException(`Detalle no encontrado id: ${id}`);
    return { message: 'Detalle encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateDetallesDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: [
        'material',
        'personaEncargada',
        'personaSolicita',
        'personaAprueba',
      ],
    });
    return { message: 'Detalle actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Detalle eliminado' };
  }
}

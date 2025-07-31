// src/area/area.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
  ) {}

  async create(dto: CreateAreaDto) {
    const nueva = this.repo.create({ ...dto });
    const guardada = await this.repo.save(nueva);
    return { message: 'Área creada', data: guardada };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: ['areasCentro', 'titulados'],
    });
    return { message: 'Listado de áreas', data: lista };
  }

  async findOne(id: number) {
    const area = await this.repo.findOne({
      where: { id },
      relations: ['areasCentro', 'titulados'],
    });
    if (!area) throw new NotFoundException(`Área no encontrada id: ${id}`);
    return { message: 'Área encontrada', data: area };
  }

  async update(id: number, dto: UpdateAreaDto) {
    const camposActualizables = ['nombre', 'activo'];
    const updateData = {};

    camposActualizables.forEach((campo) => {
      if (dto[campo] !== undefined) {
        updateData[campo] = dto[campo];
      }
    });

    const areaExistente = await this.repo.findOne({ where: { id } });
    if (!areaExistente) {
      throw new NotFoundException(`Área no encontrada id: ${id}`);
    }

    if (Object.keys(updateData).length > 0) {
      await this.repo.update(id, updateData);
    }

    const actualizada = await this.repo.findOne({
      where: { id },
      relations: ['areasCentro', 'titulados'],
    });

    return { message: 'Área actualizada', data: actualizada };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Área eliminada' };
  }
}

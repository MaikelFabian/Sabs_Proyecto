// src/areacentro/areacentro.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaCentro } from './entities/area-centro.entity';
import { Repository } from 'typeorm';
import { CreateAreaCentroDto } from './dto/create-area-centro.dto';
import { UpdateAreaCentroDto } from './dto/update-area-centro.dto';

@Injectable()
export class AreaCentroService {
  constructor(
    @InjectRepository(AreaCentro)
    private readonly repo: Repository<AreaCentro>,
  ) {}

  async create(dto: CreateAreaCentroDto) {
    const nueva = this.repo.create({ ...dto });
    const guardada = await this.repo.save(nueva);
    return { message: 'ÁreaCentro creada', data: guardada };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['centro', 'area'] });
    return { message: 'Listado de áreasCentro', data: lista };
  }

  async findOne(id: number) {
    const encontrada = await this.repo.findOne({
      where: { id },
      relations: ['centro', 'area'],
    });
    if (!encontrada)
      throw new NotFoundException(`ÁreaCentro no encontrada id: ${id}`);
    return { message: 'ÁreaCentro encontrada', data: encontrada };
  }

  async update(id: number, dto: UpdateAreaCentroDto) {
    await this.repo.update(id, dto);
    const actualizada = await this.repo.findOne({
      where: { id },
      relations: ['centro', 'area'],
    });
    return { message: 'ÁreaCentro actualizada', data: actualizada };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'ÁreaCentro eliminada' };
  }
}

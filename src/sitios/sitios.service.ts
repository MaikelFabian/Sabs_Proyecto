// src/sitio/sitio.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sitio } from './entities/sitio.entity';
import { Repository } from 'typeorm';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Injectable()
export class SitioService {
  constructor(
    @InjectRepository(Sitio)
    private readonly repo: Repository<Sitio>,
  ) {}

  async create(dto: CreateSitioDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Sitio creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['tipoSitio'] });
    return { message: 'Listado de sitios', data: lista };
  }

  async findOne(id: number) {
    const sitio = await this.repo.findOne({
      where: { id },
      relations: ['tipoSitio'],
    });
    if (!sitio) throw new NotFoundException(`Sitio no encontrado id: ${id}`);
    return { message: 'Sitio encontrado', data: sitio };
  }

  async update(id: number, dto: UpdateSitioDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['tipoSitio'],
    });
    return { message: 'Sitio actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Sitio eliminado' };
  }
}

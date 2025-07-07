// src/tipo-material/tipo-material.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoMaterial } from './entities/tipo-material.entity';
import { Repository } from 'typeorm';
import { CreateTipoMaterialDto } from './dto/create-tipo-material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo-material.dto';

@Injectable()
export class TipoMaterialService {
  constructor(
    @InjectRepository(TipoMaterial)
    private readonly repo: Repository<TipoMaterial>,
  ) {}

  async create(dto: CreateTipoMaterialDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'TipoMaterial creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['materiales'] });
    return { message: 'Listado de tipos de material', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    if (!encontrado) throw new NotFoundException(`TipoMaterial no encontrado id: ${id}`);
    return { message: 'TipoMaterial encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateTipoMaterialDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    return { message: 'TipoMaterial actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'TipoMaterial eliminado' };
  }
}

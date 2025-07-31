// src/categoria-material/categoria-material.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaMaterial } from './entities/categoria-material.entity';
import { Repository } from 'typeorm';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';

@Injectable()
export class CategoriaMaterialService {
  constructor(
    @InjectRepository(CategoriaMaterial)
    private readonly repo: Repository<CategoriaMaterial>,
  ) {}

  async create(dto: CreateCategoriaMaterialDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'CategoriaMaterial creada', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['materiales'] });
    return { message: 'Listado de categorías de material', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    if (!encontrado) throw new NotFoundException(`CategoriaMaterial no encontrada id: ${id}`);
    return { message: 'CategoriaMaterial encontrada', data: encontrado };
  }

  async update(id: number, dto: UpdateCategoriaMaterialDto) {
    const { materiales, ...updateData } = dto as any;
    
    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    return { message: 'CategoriaMaterial actualizada', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'CategoriaMaterial eliminada' };
  }
}

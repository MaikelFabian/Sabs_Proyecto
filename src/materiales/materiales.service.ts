// src/material/material.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly repo: Repository<Material>,
  ) {}

  async create(dto: CreateMaterialDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Material creado', data: guardado };
  }

  async obtenerStockCompleto() {
  return this.repo.find({
    select: ['id', 'nombre', 'descripcion', 'stock', 'activo', 'fechaVencimiento'],
    relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial'],
    where: { activo: true }
  });
}

  async findAll() {
    const lista = await this.repo.find({
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles'],
    });
    return { message: 'Listado de materiales', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles'],
    });
    if (!encontrado) throw new NotFoundException(`Material no encontrado id: ${id}`);
    return { message: 'Material encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateMaterialDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['tipoMaterial', 'unidadMedida', 'categoriaMaterial', 'detalles'],
    });
    return { message: 'Material actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Material eliminado' };
  }
}

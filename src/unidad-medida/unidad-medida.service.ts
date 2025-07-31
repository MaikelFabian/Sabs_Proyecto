// src/unidad-medida/unidad-medida.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadMedida } from './entities/unidad-medida.entity';
import { Repository } from 'typeorm';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';

@Injectable()
export class UnidadMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly repo: Repository<UnidadMedida>,
  ) {}

  async create(dto: CreateUnidadMedidaDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'UnidadMedida creada', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['materiales'] });
    return { message: 'Listado de unidades de medida', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    if (!encontrado) throw new NotFoundException(`UnidadMedida no encontrada id: ${id}`);
    return { message: 'UnidadMedida encontrada', data: encontrado };
  }

  async update(id: number, dto: UpdateUnidadMedidaDto) {
    const { materiales, ...updateData } = dto as any;
    
    await this.repo.update(id, updateData);
    const actualizado = await this.repo.findOne({ where: { id }, relations: ['materiales'] });
    return { message: 'UnidadMedida actualizada', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'UnidadMedida eliminada' };
  }
}

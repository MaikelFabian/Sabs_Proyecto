// src/ficha/ficha.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ficha } from './entities/ficha.entity';
import { Repository } from 'typeorm';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';

@Injectable()
export class FichaService {
  constructor(
    @InjectRepository(Ficha)
    private readonly repo: Repository<Ficha>,
  ) {}

  async create(dto: CreateFichaDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Ficha creada', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({
      relations: ['personas', 'titulados'],
    });
    return { message: 'Listado de fichas', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: ['personas', 'titulados'],
    });
    if (!encontrado)
      throw new NotFoundException(`Ficha no encontrada id: ${id}`);
    return { message: 'Ficha encontrada', data: encontrado };
  }

  async update(id: number, dto: UpdateFichaDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['personas', 'titulados'],
    });
    return { message: 'Ficha actualizada', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Ficha eliminada' };
  }
}

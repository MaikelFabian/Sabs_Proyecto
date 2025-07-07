import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Titulado } from './entities/titulado.entity';
import { Repository } from 'typeorm';
import { CreateTituladoDto } from './dto/create-titulado.dto';
import { UpdateTituladoDto } from './dto/update-titulado.dto';

@Injectable()
export class TituladoService {
  constructor(
    @InjectRepository(Titulado)
    private readonly repo: Repository<Titulado>,
  ) {}

  async create(dto: CreateTituladoDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Titulado creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['area', 'ficha'] });
    return { message: 'Listado de titulados', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({
      where: { id },
      relations: ['area', 'ficha'],
    });
    if (!encontrado)
      throw new NotFoundException(`Titulado no encontrado id: ${id}`);
    return { message: 'Titulado encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateTituladoDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['area', 'ficha'],
    });
    return { message: 'Titulado actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Titulado eliminado' };
  }
}

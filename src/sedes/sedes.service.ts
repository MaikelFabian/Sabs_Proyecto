import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sede } from './entities/sede.entity';
import { Repository } from 'typeorm';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedeService {
  constructor(
    @InjectRepository(Sede)
    private readonly repo: Repository<Sede>,
  ) {}

  async create(dto: CreateSedeDto) {
    const nueva = this.repo.create({ ...dto });
    const guardada = await this.repo.save(nueva);
    return { message: 'Sede creada', data: guardada };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['centro'] });
    return { message: 'Listado de sedes', data: lista };
  }

  async findOne(id: number) {
    const sede = await this.repo.findOne({ where: { id }, relations: ['centro'] });
    if (!sede) throw new NotFoundException(`Sede no encontrada id: ${id}`);
    return { message: 'Sede encontrada', data: sede };
  }

  async update(id: number, dto: UpdateSedeDto) {
    await this.repo.update(id, dto);
    const actualizada = await this.repo.findOne({ where: { id }, relations: ['centro'] });
    return { message: 'Sede actualizada', data: actualizada };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Sede eliminada' };
  }
}

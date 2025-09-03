import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';
import { Repository } from 'typeorm';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';

@Injectable()
export class MunicipioService {
  constructor(
    @InjectRepository(Municipio)
    private readonly repo: Repository<Municipio>,
  ) {}

  async create(dto: CreateMunicipioDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Municipio creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['centros'] });
    return { message: 'Listado de municipios', data: lista };
  }

  async findOne(id: number) {
    const municipio = await this.repo.findOne({
      where: { id },
      relations: ['centros'],
    });
    if (!municipio)
      throw new NotFoundException(`Municipio no encontrado id: ${id}`);
    return { message: 'Municipio encontrado', data: municipio };
  }

  async update(id: number, dto: UpdateMunicipioDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['centros'],
    });
    return { message: 'Municipio actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Municipio eliminado' };
  }
}

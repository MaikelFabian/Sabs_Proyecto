import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Centro } from './entities/centro.entity';
import { Repository } from 'typeorm';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';

@Injectable()
export class CentroService {
  constructor(
    @InjectRepository(Centro)
    private readonly repo: Repository<Centro>,
  ) {}

  async create(dto: CreateCentroDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'Centro creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['municipio', 'areasCentro', 'sedes'] });
    return { message: 'Listado de centros', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.repo.findOne({ where: { id }, relations: ['municipio', 'areasCentro', 'sedes'] });
    if (!encontrado) throw new NotFoundException(`Centro no encontrado id: ${id}`);
    return { message: 'Centro encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateCentroDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({ where: { id }, relations: ['municipio', 'areasCentro', 'sedes'] });
    return { message: 'Centro actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'Centro eliminado' };
  }
}

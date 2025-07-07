import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoSitio } from './entities/tipo-sitio.entity';
import { Repository } from 'typeorm';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';

@Injectable()
export class TipoSitioService {
  constructor(
    @InjectRepository(TipoSitio)
    private readonly repo: Repository<TipoSitio>,
  ) {}

  async create(dto: CreateTipoSitioDto) {
    const nuevo = this.repo.create({ ...dto });
    const guardado = await this.repo.save(nuevo);
    return { message: 'TipoSitio creado', data: guardado };
  }

  async findAll() {
    const lista = await this.repo.find({ relations: ['sitios'] });
    return { message: 'Listado de tipos de sitio', data: lista };
  }

  async findOne(id: number) {
    const tipo = await this.repo.findOne({
      where: { id },
      relations: ['sitios'],
    });
    if (!tipo) throw new NotFoundException(`TipoSitio no encontrado id: ${id}`);
    return { message: 'TipoSitio encontrado', data: tipo };
  }

  async update(id: number, dto: UpdateTipoSitioDto) {
    await this.repo.update(id, dto);
    const actualizado = await this.repo.findOne({
      where: { id },
      relations: ['sitios'],
    });
    return { message: 'TipoSitio actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { message: 'TipoSitio eliminado' };
  }
}

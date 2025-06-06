import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(data: Partial<Area>) {
    const nuevo = await this.areaRepository.save(data);
    return {
      message: 'area creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.areaRepository.find({
      relations: [
        'areascentro',
        'titulado',
      ],
    });
    return {
      message: 'Listado de areas',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.areaRepository.findOne({
      where: { idarea: id },
      relations: [
        'areascentro',
        'titulado',
      ],
    });
    return {
      message: 'area encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Area>) {
    await this.areaRepository.update(id, data);
    const actualizado = await this.areaRepository.findOneBy({
      idarea: id,
    });
    return {
      message: 'area actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.areaRepository.delete(id);
    return {
      message: 'area eliminado exitosamente',
    };
  }
}
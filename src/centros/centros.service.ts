import { Injectable } from '@nestjs/common';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';
import { Centro } from './entities/centro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CentrosService {
  constructor(
    @InjectRepository(Centro)
    private readonly centroRepository: Repository<Centro>,
  ) {}

  async create(data: Partial<Centro>) {
    const nuevo = await this.centroRepository.save(data);
    return {
      message: 'centro creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.centroRepository.find({
      relations: ['areacentro', 'municipio', 'sede'],
    });
    return {
      message: 'Listado de centros',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.centroRepository.findOne({
      where: { id: id },
      relations: ['areacentro', 'municipio', 'sede'],
    });
    return {
      message: 'centro encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Centro>) {
    await this.centroRepository.update(id, data);
    const actualizado = await this.centroRepository.findOneBy({
      id: id,
    });
    return {
      message: 'centro actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.centroRepository.delete(id);
    return {
      message: 'centro eliminado exitosamente',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
  ) {}

  async create(data: Partial<Municipio>) {
    const nuevo = await this.municipioRepository.save(data);
    return {
      message: 'municipios creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.municipioRepository.find({
      relations: ['centros'],
    });
    return {
      message: 'Listado de municipios',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.municipioRepository.findOne({
      where: { id: id },
      relations: ['centros'],
    });
    return {
      message: 'municipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Municipio>) {
    await this.municipioRepository.update(id, data);
    const actualizado = await this.municipioRepository.findOneBy({
      id: id,
    });
    return {
      message: 'municipio actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.municipioRepository.delete(id);
    return {
      message: 'municipio eliminado exitosamente',
    };
  }
}

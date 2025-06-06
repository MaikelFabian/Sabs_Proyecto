import { Injectable } from '@nestjs/common';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipositio } from './entities/tipo-sitio.entity';

@Injectable()
export class TipoSitioService {
  constructor(
    @InjectRepository(Tipositio)
    private readonly tipositioRepository: Repository<Tipositio>,
  ) {}

  async create(data: Partial<Tipositio>) {
    const nuevo = await this.tipositioRepository.save(data);
    return {
      message: 'tipo de municipio  creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.tipositioRepository.find({
      relations: [
        'sitios',

      ],
    });
    return {
      message: 'Listado de tipo de municipio',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.tipositioRepository.findOne({
      where: { idtipositio: id },
      relations: [
        'sitios',

      ],
    });
    return {
      message: 'tipo de municipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Tipositio>) {
    await this.tipositioRepository.update(id, data);
    const actualizado = await this.tipositioRepository.findOneBy({
      idtipositio: id,
    });
    return {
      message: 'tipo de municipio actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.tipositioRepository.delete(id);
    return {
      message: 'tipo de municipio eliminado exitosamente',
    };
  }
}

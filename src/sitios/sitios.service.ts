import { Injectable } from '@nestjs/common';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';
import { Sitio } from './entities/sitio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class SitiosService {
  constructor(
    @InjectRepository(Sitio)
    private readonly sitioRepository: Repository<Sitio>,
  ) {}

  async create(data: Partial<Sitio>) {
    const nuevo = await this.sitioRepository.save(data);
    return {
      message: 'sitio creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.sitioRepository.find({
      relations: [
        'tipositio',

      ],
    });
    return {
      message: 'Listado de sitio',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.sitioRepository.findOne({
      where: { idsitio: id },
      relations: [
        'tipositio',

      ],
    });
    return {
      message: 'sitio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Sitio>) {
    await this.sitioRepository.update(id, data);
    const actualizado = await this.sitioRepository.findOneBy({
      idsitio: id,
    });
    return {
      message: 'sitio actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.sitioRepository.delete(id);
    return {
      message: 'sitio eliminado exitosamente',
    };
  }
}

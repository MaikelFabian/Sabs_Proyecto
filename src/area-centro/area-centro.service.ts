import { Injectable } from '@nestjs/common';
import { CreateAreaCentroDto } from './dto/create-area-centro.dto';
import { UpdateAreaCentroDto } from './dto/update-area-centro.dto';
import { Areacentro } from './entities/area-centro.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AreacentroService {
  constructor(
    @InjectRepository(Areacentro)
    private readonly areacentroRepository: Repository<Areacentro>,
  ) {}

  async create(data: Partial<Areacentro>) {
    const nuevo = await this.areacentroRepository.save(data);
    return {
      message: 'Areacentro creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.areacentroRepository.find({
      relations: [
        'area',
        'centro',
      ],
    });
    return {
      message: 'Listado de elementos',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.areacentroRepository.findOne({
      where: { idareacentro: id },
      relations: [
        'area',
        'centro',
      ],
    });
    return {
      message: 'Elemento encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Areacentro>) {
    await this.areacentroRepository.update(id, data);
    const actualizado = await this.areacentroRepository.findOneBy({
      idareacentro: id,
    });
    return {
      message: 'area-centro  actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.areacentroRepository.delete(id);
    return {
      message: 'area-centro eliminado exitosamente',
    };
  }
}
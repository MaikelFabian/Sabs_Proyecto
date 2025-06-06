import { Injectable } from '@nestjs/common';
import { CreateTituladoDto } from './dto/create-titulado.dto';
import { UpdateTituladoDto } from './dto/update-titulado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Titulado } from './entities/titulado.entity';



@Injectable()
export class TituladosService {
  constructor(
    @InjectRepository(Titulado)
    private readonly tituladoRepository: Repository<Titulado>,
  ) {}

  async create(data: Partial<Titulado>) {
    const nuevo = await this.tituladoRepository.save(data);
    return {
      message: 'titulado creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.tituladoRepository.find({
      relations: [
        'area',
        'ficha',

      ],
    });
    return {
      message: 'Listado de titulados',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.tituladoRepository.findOne({
      where: { idtitulado: id },
      relations: [
        'area',
        'ficha',

      ],
    });
    return {
      message: 'titulado encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Titulado>) {
    await this.tituladoRepository.update(id, data);
    const actualizado = await this.tituladoRepository.findOneBy({
      idtitulado: id,
    });
    return {
      message: 'titulado actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.tituladoRepository.delete(id);
    return {
      message: 'titulado eliminado exitosamente',
    };
  }
}

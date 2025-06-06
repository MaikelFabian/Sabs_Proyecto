import { Injectable } from '@nestjs/common';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidadmedida } from './entities/unidad-medida.entity';


@Injectable()
export class UnidadMedidaService {
  constructor(
    @InjectRepository(Unidadmedida)
    private readonly unidadmedidaRepository: Repository<Unidadmedida>,
  ) {}

  async create(data: Partial<Unidadmedida>) {
    const nuevo = await this.unidadmedidaRepository.save(data);
    return {
      message: 'unidad de medida  creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.unidadmedidaRepository.find({
      relations: [
        'materials',

      ],
    });
    return {
      message: 'Listado de unidad de medida ',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.unidadmedidaRepository.findOne({
      where: { idunidadmedida: id },
      relations: [
        'materials',

      ],
    });
    return {
      message: 'unidad de medida  encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Unidadmedida>) {
    await this.unidadmedidaRepository.update(id, data);
    const actualizado = await this.unidadmedidaRepository.findOneBy({
      idunidadmedida: id,
    });
    return {
      message: 'unidad de medida  actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.unidadmedidaRepository.delete(id);
    return {
      message: 'unidad de medida  eliminado exitosamente',
    };
  }
}
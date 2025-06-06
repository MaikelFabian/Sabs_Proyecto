import { Injectable } from '@nestjs/common';
import { CreateDetalleDto } from './dto/create-detalle.dto';
import { UpdateDetalleDto } from './dto/update-detalle.dto';
import { Detalles } from './entities/detalle.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetallesService {
  constructor(
    @InjectRepository(Detalles)
    private readonly detallesRepository: Repository<Detalles>,
  ) {}

  async create(data: Partial<Detalles>) {
    const nuevo = await this.detallesRepository.save(data);
    return {
      message: 'detalles creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.detallesRepository.find({
      relations: [
        'personaaprueba',
        'personaencargada',
        'personasolicita',
        'material',
      ],
    });
    return {
      message: 'Listado de detalles',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.detallesRepository.findOne({
      where: { iddetalle: id },
      relations: [
        'personaaprueba',
        'personaencargada',
        'personasolicita',
        'material',
      ],
    });
    return {
      message: 'detalles encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Detalles>) {
    await this.detallesRepository.update(id, data);
    const actualizado = await this.detallesRepository.findOneBy({
      iddetalle: id,
    });
    return {
      message: 'detalles actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.detallesRepository.delete(id);
    return {
      message: 'detalles eliminado exitosamente',
    };
  }
}
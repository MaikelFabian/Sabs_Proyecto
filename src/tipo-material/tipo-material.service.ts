import { Injectable } from '@nestjs/common';
import { CreateTipoMaterialDto } from './dto/create-tipo-material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipomaterial } from './entities/tipo-material.entity';

@Injectable()
export class TipoMaterialService {
  constructor(
    @InjectRepository(Tipomaterial)
    private readonly tipomaterialRepository: Repository<Tipomaterial>,
  ) {}

  async create(data: Partial<Tipomaterial>) {
    const nuevo = await this.tipomaterialRepository.save(data);
    return {
      message: 'tipo de material  creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.tipomaterialRepository.find({
      relations: ['materials'],
    });
    return {
      message: 'Listado de tipos de materiales',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.tipomaterialRepository.findOne({
      where: { id: id },
      relations: ['materials'],
    });
    return {
      message: 'municipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Tipomaterial>) {
    await this.tipomaterialRepository.update(id, data);
    const actualizado = await this.tipomaterialRepository.findOneBy({
      id: id,
    });
    return {
      message: 'tipomaterial actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.tipomaterialRepository.delete(id);
    return {
      message: 'tipomaterial eliminado exitosamente',
    };
  }
}

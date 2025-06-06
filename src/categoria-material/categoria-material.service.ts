import { Injectable } from '@nestjs/common';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';
import { Categoriamaterial } from './entities/categoria-material.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaMaterialService {
  constructor(
    @InjectRepository(Categoriamaterial)
    private readonly CategoriamaterialRepository: Repository<Categoriamaterial>,
  ) {}

  async create(data: Partial<Categoriamaterial>) {
    const nuevo = await this.CategoriamaterialRepository.save(data);
    return {
      message: 'Categoriamaterial creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.CategoriamaterialRepository.find({
      relations: [
        'materials',
      ],
    });
    return {
      message: 'Listado de Categoriamaterial',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.CategoriamaterialRepository.findOne({
      where: { idcategoriamaterial: id },
      relations: [
      'materials',

      ],
    });
    return {
      message: 'Categoriamaterial encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Categoriamaterial>) {
    await this.CategoriamaterialRepository.update(id, data);
    const actualizado = await this.CategoriamaterialRepository.findOneBy({
      idcategoriamaterial: id,
    });
    return {
      message: 'ElCategoriamaterialemento actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.CategoriamaterialRepository.delete(id);
    return {
      message: 'Categoriamaterial eliminado exitosamente',
    };
  }
}

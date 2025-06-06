import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/materiale.entity';

@Injectable()
export class materialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(data: Partial<Material>) {
    const nuevo = await this.materialRepository.save(data);
    return {
      message: 'material creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.materialRepository.find({
      relations: [
        'detalles',
        'categoriamaterial',
        'tipomaterial',
        'unidadmedida',
      ],
    });
    return {
      message: 'Listado de elementos',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.materialRepository.findOne({
      where: { idmaterial: id },
      relations: [
        'Detalles',
        'Categoriamaterial',
        'Tipomaterial',
        'Unidadmedida',
      ],
    });
    return {
      message: 'Elemento encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Material>) {
    await this.materialRepository.update(id, data);
    const actualizado = await this.materialRepository.findOneBy({
      idmaterial: id,
    });
    return {
      message: 'Elemento actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.materialRepository.delete(id);
    return {
      message: 'Elemento eliminado exitosamente',
    };
  }
}
import { Injectable } from '@nestjs/common';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';


@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async create(data: Partial<Permiso>) {
    const nuevo = await this.permisoRepository.save(data);
    return {
      message: 'municipios creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.permisoRepository.find({
      relations: [
        'rolpermisos',

      ],
    });
    return {
      message: 'Listado de permisos',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.permisoRepository.findOne({
      where: { idpermiso: id },
      relations: [
        'rolpermisos',

      ],
    });
    return {
      message: 'permiso encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Permiso>) {
    await this.permisoRepository.update(id, data);
    const actualizado = await this.permisoRepository.findOneBy({
      idpermiso: id,
    });
    return {
      message: 'permiso actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.permisoRepository.delete(id);
    return {
      message: 'permiso eliminado exitosamente',
    };
  }
}

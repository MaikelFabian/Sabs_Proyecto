import { Injectable } from '@nestjs/common';
import { CreateRolpermisoDto } from './dto/create-rolpermiso.dto';
import { UpdateRolpermisoDto } from './dto/update-rolpermiso.dto';
import { Rolpermiso } from './entities/rolpermiso.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class RolpermisoService {
  constructor(
    @InjectRepository(Rolpermiso)
    private readonly rolpermisoRepository: Repository<Rolpermiso>,
  ) {}

  async create(data: Partial<Rolpermiso>) {
    const nuevo = await this.rolpermisoRepository.save(data);
    return {
      message: 'municipios creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.rolpermisoRepository.find({
      relations: [
        'permisos',
        'rol',


      ],
    });
    return {
      message: 'Listado de municipios',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.rolpermisoRepository.findOne({
      where: { idrolpermiso: id },
      relations: [
        'permisos',
        'rol',

      ],
    });
    return {
      message: 'municipio encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Rolpermiso>) {
    await this.rolpermisoRepository.update(id, data);
    const actualizado = await this.rolpermisoRepository.findOneBy({
      idrolpermiso: id,
    });
    return {
      message: 'municipio actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.rolpermisoRepository.delete(id);
    return {
      message: 'municipio eliminado exitosamente',
    };
  }
}

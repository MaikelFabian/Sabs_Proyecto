import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';



@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(data: Partial<Rol>) {
    const nuevo = await this.rolRepository.save(data);
    return {
      message: 'rol creado exitosamente',
      data: nuevo,
    };
  }

  async findAll() {
    const listar = await this.rolRepository.find({
      relations: [
        'personas',
        'rolpermisos',

      ],
    });
    return {
      message: 'Listado de roles',
      data: listar,
    };
  }

  async findOne(id: number) {
    const buscar = await this.rolRepository.findOne({
      where: { idrol: id },
      relations: [
        'personas',
        'rolpermisos',

      ],
    });
    return {
      message: 'rol encontrado',
      data: buscar,
    };
  }

  async update(id: number, data: Partial<Rol>) {
    await this.rolRepository.update(id, data);
    const actualizado = await this.rolRepository.findOneBy({
      idrol: id,
    });
    return {
      message: 'rol actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.rolRepository.delete(id);
    return {
      message: 'rol eliminado exitosamente',
    };
  }
}

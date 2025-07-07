// src/rol/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRolDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto) {
    const nuevo = this.rolRepository.create(createRolDto);
    const guardado = await this.rolRepository.save(nuevo);
    return {
      message: 'Rol creado exitosamente',
      data: guardado,
    };
  }

  async findAll() {
    const lista = await this.rolRepository.find({ relations: ['personas', 'permisos'] });
    return {
      message: 'Listado de roles',
      data: lista,
    };
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['personas', 'permisos'],
    });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return {
      message: 'Rol encontrado',
      data: rol,
    };
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    await this.rolRepository.update(id, updateRolDto);
    const actualizado = await this.rolRepository.findOneBy({ id });
    return {
      message: 'Rol actualizado exitosamente',
      data: actualizado,
    };
  }

  async remove(id: number) {
    await this.rolRepository.delete(id);
    return {
      message: 'Rol eliminado exitosamente',
    };
  }
}

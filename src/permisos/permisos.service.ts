import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  async create(dto: CreatePermisoDto) {
    const nuevo = this.permisoRepo.create(dto);
    const guardado = await this.permisoRepo.save(nuevo);
    return { message: 'Permiso creado', data: guardado };
  }

  async findAll() {
    const lista = await this.permisoRepo.find({ relations: ['opcion'] });
    return { message: 'Listado de permisos', data: lista };
  }

  async findOne(id: number) {
    const permiso = await this.permisoRepo.findOne({ where: { id }, relations: ['opcion'] });
    if (!permiso) throw new NotFoundException(`Permiso id ${id} no encontrado`);
    return { message: 'Permiso encontrado', data: permiso };
  }

  async update(id: number, dto: UpdatePermisoDto) {
    await this.permisoRepo.update(id, dto);
    const actualizado = await this.permisoRepo.findOneBy({ id });
    return { message: 'Permiso actualizado', data: actualizado };
  }

  async remove(id: number) {
    await this.permisoRepo.delete(id);
    return { message: 'Permiso eliminado' };
  }
}

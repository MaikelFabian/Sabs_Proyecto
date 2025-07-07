import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermisoOpcion } from './entities/rol-permiso-opcion.entity';
import { CreateRolPermisoOpcionDto } from './dto/create-rol-permiso-opcion.dto';
import { UpdateRolPermisoOpcionDto } from './dto/update-rol-permiso-opcion.dto';

@Injectable()
export class RolPermisoOpcionService {
  constructor(
    @InjectRepository(RolPermisoOpcion)
    private readonly rpoRepo: Repository<RolPermisoOpcion>,
  ) {}

 async create(dto: CreateRolPermisoOpcionDto) {
  const nuevo = this.rpoRepo.create({
    rol: dto.rolId ? { id: dto.rolId } : undefined,
    permiso: dto.permisoId ? { id: dto.permisoId } : undefined,
    opcion: dto.opcionId ? { id: dto.opcionId } : undefined,
  });
  const guardado = await this.rpoRepo.save(nuevo);
  return { message: 'RolPermisoOpcion creado', data: guardado };
}


  async findAll() {
    const lista = await this.rpoRepo.find({
      relations: ['rol', 'permiso', 'opcion'],
    });
    return { message: 'Listado de RolPermisoOpcion', data: lista };
  }

  async findOne(id: number) {
    const encontrado = await this.rpoRepo.findOne({
      where: { id },
      relations: ['rol', 'permiso', 'opcion'],
    });
    if (!encontrado) throw new NotFoundException(`No encontrado id ${id}`);
    return { message: 'RolPermisoOpcion encontrado', data: encontrado };
  }

  async update(id: number, dto: UpdateRolPermisoOpcionDto) {
  await this.rpoRepo.update(id, {
    rol: dto.rolId ? { id: dto.rolId } : undefined,
    permiso: dto.permisoId ? { id: dto.permisoId } : undefined,
    opcion: dto.opcionId ? { id: dto.opcionId } : undefined,
  });
  const actualizado = await this.rpoRepo.findOne({
    where: { id },
    relations: ['rol', 'permiso', 'opcion'],
  });
  return { message: 'RolPermisoOpcion actualizado', data: actualizado };
}

  async remove(id: number) {
    await this.rpoRepo.delete(id);
    return { message: 'RolPermisoOpcion eliminado' };
  }
}

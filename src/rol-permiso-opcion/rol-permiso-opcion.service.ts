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

  // Obtener permisos de un rol específico
  async findPermisosByRol(rolId: number) {
    const permisos = await this.rpoRepo.find({
      where: { rol: { id: rolId } },
      relations: ['rol', 'permiso', 'opcion'],
    });
    return { message: 'Permisos del rol', data: permisos };
  }

  async asignarPermisosARol(rolId: number, permisosData: { permisoId: number, opcionId?: number }[]) {
    await this.rpoRepo.delete({ rol: { id: rolId } });
    

    const nuevosPermisos = permisosData.map(item => 
      this.rpoRepo.create({
        rol: { id: rolId },
        permiso: { id: item.permisoId },
        opcion: item.opcionId ? { id: item.opcionId } : undefined,
      })
    );
    
    const guardados = await this.rpoRepo.save(nuevosPermisos);
    return { message: 'Permisos asignados al rol', data: guardados };
  }


async findAllPermisosDisponibles(rolId?: number) {
  let query = `
    SELECT 
      p.id, 
      p.nombre, 
      p.codigo,
      o.id as "opcionId", 
      o.nombre as "opcionNombre"`;
  
  if (rolId) {
    query += `,
      CASE WHEN rpo.id IS NOT NULL THEN true ELSE false END as asignado`;
  }
  
  query += `
    FROM permiso p
    LEFT JOIN opcion o ON p."opcionId" = o.id`;
  
  if (rolId) {
    query += `
    LEFT JOIN rol_permiso_opcion rpo ON p.id = rpo."permisoId" AND rpo."rolId" = ${rolId}`;
  }
  
  query += `
    WHERE p.activo = true
    ORDER BY o.nombre, p.nombre`;
  
  const permisos = await this.rpoRepo.query(query);
  return { message: 'Permisos disponibles', data: permisos };
}
}

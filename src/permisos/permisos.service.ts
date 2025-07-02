import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async findAll(): Promise<Permiso[]> {
    return this.permisoRepository.find({ relations: ['rol', 'opcion'] });
  }

  async findOne(idpermiso: number): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { idpermiso },
      relations: ['rol', 'opcion'],
    });
    if (!permiso) throw new NotFoundException('Permiso con ID ${id} no encontrado');
    return permiso;
  }

  async create(data: Partial<Permiso>): Promise<Permiso> {
    const permiso = this.permisoRepository.create(data);
    return this.permisoRepository.save(permiso);
  }

  async update(id: number, data: Partial<Permiso>): Promise<Permiso> {
    const permiso = await this.findOne(id);
    Object.assign(permiso, data);
    return this.permisoRepository.save(permiso);
  }

  async remove(id: number): Promise<void> {
    const permiso = await this.findOne(id);
    await this.permisoRepository.remove(permiso);
  }

  async getPermisosPorRol(idRol: number): Promise<Permiso[]> {
    const permisos = await this.permisoRepository.find({
      where: {
        rol: { idrol: idRol },
      },
      relations: ['rol', 'opcion'],
    });

    return permisos;
  }


  async obtenerPorRol(idRol: number): Promise<Permiso[]> {
  return this.permisoRepository.find({
    where: { rol: { idrol: idRol } },
    relations: ['opcion', 'rol'],
    order: {
      opcion: {
        nombre_opcion: 'ASC',
      },
    },
  });
}

  async getPermisoPorRutaYRol(ruta: string, idRol: number) {
    const permiso = await this.permisoRepository
      .createQueryBuilder('permiso')
      .innerJoinAndSelect('permiso.opcion', 'opcion')
      .innerJoin('permiso.rol', 'rol')
      .where('opcion.ruta_frontend = :ruta', { ruta })
      .andWhere('rol.id = :idRol', { idRol })
      .select([
        'permiso.puedeVer',
        'permiso.puedeCrear',
        'permiso.puedeEditar',
        'permiso.puedeEliminar',
      ])
      .getOne();

    return permiso || {
      puedeVer: false,
      puedeCrear: false,
      puedeEditar: false,
      puedeEliminar: false,
    };
  }
}
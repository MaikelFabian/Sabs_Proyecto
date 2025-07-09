// src/auth/guards/permisos.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { PERMISSIONS_KEY } from '../guards/permisos.decorator';
import { mapMetodoToPermiso } from '../helpers/map-metodo-to-permiso';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolPermisoOpcion)
    private readonly repo: Repository<RolPermisoOpcion>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const path = request.route.path; // Ej: /usuarios/:id
    const metodo = request.method;

    // Leer permisos explícitos del decorator
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si hay permisos específicos, validar contra ellos
    if (permisosRequeridos && permisosRequeridos.length > 0) {
      const tienePermiso = await this.repo
        .createQueryBuilder('rpo')
        .leftJoinAndSelect('rpo.permiso', 'permiso')
        .leftJoinAndSelect('rpo.opcion', 'opcion')
        .where('rpo.rolId = :rolId', { rolId: user.rolId })
        .andWhere('permiso.codigo IN (:...codigos)', { codigos: permisosRequeridos })
        .andWhere(':path LIKE CONCAT(opcion.rutaFrontend, "%")', { path })
        .getOne();

      if (!tienePermiso) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción');
      }

      return true;
    }

    // Si no hay decorator, usar mapeo método → permiso
    const permisoRequerido = mapMetodoToPermiso(metodo);

    const tienePermiso = await this.repo
      .createQueryBuilder('rpo')
      .leftJoinAndSelect('rpo.permiso', 'permiso')
      .leftJoinAndSelect('rpo.opcion', 'opcion')
      .where('rpo.rolId = :rolId', { rolId: user.rolId })
      .andWhere('permiso.codigo = :codigo', { codigo: permisoRequerido })
      .andWhere(':path LIKE CONCAT(opcion.rutaFrontend, "%")', { path })
      .getOne();

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permiso para realizar esta acción');
    }

    return true;
  }
}

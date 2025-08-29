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
import { PERMISSIONS_KEY } from './permisos.decorator';
import { mapMetodoToPermiso } from '../helpers/map-metodo-to-permiso';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolPermisoOpcion)
    private readonly repo: Repository<RolPermisoOpcion>,
  ) {
    console.log('✅ PermisosGuard construido');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🔐 JwtAuthGuard activado');
    

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('👤 User en PermisosGuard:', JSON.stringify(user, null, 2));
    const path = request.route.path;
    const metodo = request.method;
    console.log('========= PermisosGuard =========');
    console.log('Usuario:', user);
    console.log('Path:', path);
    console.log('Method:', metodo);
    console.log('Permiso encontrado, acceso concedido');
    console.log('NO se encontró permiso, acceso denegado');

    // Leer permisos explícitos del decorator
    const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('🔒 Permisos requeridos por decorator:', permisosRequeridos);

    // Si hay permisos específicos, validar contra ellos
    if (permisosRequeridos && permisosRequeridos.length > 0) {
      const tienePermiso = await this.repo
        .createQueryBuilder('rpo')
        .leftJoinAndSelect('rpo.permiso', 'permiso')
        .leftJoinAndSelect('rpo.opcion', 'opcion')
        .where('rpo.rolId = :rolId', { rolId: user.rolId })
        
        .andWhere('permiso.codigo IN (:...codigos)', {
          codigos: permisosRequeridos,
        })
        .andWhere(':path LIKE opcion.rutaFrontend || \'%\'', { path })

        .getOne();
      console.log('path', path);
      console.log('permisosRequeridos', permisosRequeridos);

      if (!tienePermiso) {
        throw new ForbiddenException(
          'No tienes permiso para realizar esta acción',
        );
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
      .andWhere(':path LIKE opcion.rutaFrontend || \'%\'', { path })
      .getOne();

    if (!tienePermiso) {
      throw new ForbiddenException(
        'No tienes permiso para realizar esta acción',
      );
    }

    return true;
  }
}

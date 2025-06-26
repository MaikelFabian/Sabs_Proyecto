import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { mapMetodoToPermiso } from '../helpers/map-metodo-to-permiso';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    @InjectRepository(RolPermisoOpcion)
    private readonly repo: Repository<RolPermisoOpcion>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Suponiendo que viene desde JWT
    const path = request.route.path;
    const metodo = request.method;

    const permisoRequerido = mapMetodoToPermiso(metodo);

    const tienePermiso = await this.repo.findOne({
    where: {
    rol: { id: user.rolId },
    permiso: { codigo: permisoRequerido },
    opcion: { rutaFrontend: path },
  } as any,
});

    return !!tienePermiso;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolPermisoOpcion } from './entities/rol-permiso-opcion.entity';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { RolPermisoOpcionController } from './rol-permiso-opcion.controller';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';


@Module({
  imports: [TypeOrmModule.forFeature([RolPermisoOpcion])],
  controllers: [RolPermisoOpcionController],
  providers: [RolPermisoOpcionService, PermisosGuard], 
  exports: [PermisosGuard, TypeOrmModule], 
})
export class RolPermisoOpcionModule {}

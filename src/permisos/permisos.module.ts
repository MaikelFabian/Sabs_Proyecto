import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolPermisoOpcion, Permiso]),
  ],
  providers: [PermisosService],
  controllers: [PermisosController],
})
export class PermisosModule {}
// src/material/material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialService } from './materiales.service';
import { MaterialController } from './materiales.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';


@Module({
  imports: [TypeOrmModule.forFeature([Material]), RolPermisoOpcionModule],
  controllers: [MaterialController],
  providers: [MaterialService, PermisosGuard,],
  exports: [MaterialService],
})
export class MaterialModule {}

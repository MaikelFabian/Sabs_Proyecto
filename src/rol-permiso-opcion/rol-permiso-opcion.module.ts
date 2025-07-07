import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolPermisoOpcion } from './entities/rol-permiso-opcion.entity';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { RolPermisoOpcionController } from './rol-permiso-opcion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RolPermisoOpcion])],
  controllers: [RolPermisoOpcionController],
  providers: [RolPermisoOpcionService],
  exports: [RolPermisoOpcionService],
})
export class RolPermisoOpcionModule {}

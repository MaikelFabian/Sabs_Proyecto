import { Module } from '@nestjs/common';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { RolPermisoOpcionController } from './rol-permiso-opcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolPermisoOpcion } from './entities/rol-permiso-opcion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([RolPermisoOpcion])],
  controllers: [RolPermisoOpcionController],
  providers: [RolPermisoOpcionService],
})
export class RolPermisoOpcionModule {}

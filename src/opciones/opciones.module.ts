import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opcion } from './entities/opcion.entity';
import { OpcionesService } from './opciones.service';
import { OpcionesController } from './opciones.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Opcion]),RolPermisoOpcionModule],
  controllers: [OpcionesController],
  providers: [OpcionesService],
  exports: [OpcionesService],
})
export class OpcionesModule {}

// src/detalles/detalles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detalles } from './entities/detalle.entity';
import { DetallesService } from './detalles.service';
import { DetallesController } from './detalles.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Detalles]),RolPermisoOpcionModule],
  controllers: [DetallesController],
  providers: [DetallesService],
  exports: [DetallesService],
})
export class DetallesModule {}

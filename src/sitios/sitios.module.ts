// src/sitio/sitio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sitio } from './entities/sitio.entity';
import { SitioService } from './sitios.service';
import { SitioController } from './sitios.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sitio]),RolPermisoOpcionModule],
  controllers: [SitioController],
  providers: [SitioService],
  exports: [SitioService],
})
export class SitioModule {}

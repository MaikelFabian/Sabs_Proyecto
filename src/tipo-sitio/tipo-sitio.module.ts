// src/tipositio/tipositio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSitio } from './entities/tipo-sitio.entity';
import { TipoSitioService } from './tipo-sitio.service';
import { TipoSitioController } from './tipo-sitio.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSitio]),RolPermisoOpcionModule],
  controllers: [TipoSitioController],
  providers: [TipoSitioService],
  exports: [TipoSitioService],
})
export class TipoSitioModule {}

// src/areacentro/areacentro.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaCentro } from './entities/area-centro.entity';
import { AreaCentroService } from './area-centro.service';
import { AreaCentroController } from './area-centro.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([AreaCentro]),RolPermisoOpcionModule],
  controllers: [AreaCentroController],
  providers: [AreaCentroService],
  exports: [AreaCentroService],
})
export class AreaCentroModule {}

// src/categoria-material/categoria-material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaMaterial } from './entities/categoria-material.entity';
import { CategoriaMaterialService } from './categoria-material.service';
import { CategoriaMaterialController } from './categoria-material.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaMaterial]),RolPermisoOpcionModule],
  controllers: [CategoriaMaterialController],
  providers: [CategoriaMaterialService],
  exports: [CategoriaMaterialService],
})
export class CategoriaMaterialModule {}

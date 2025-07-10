// src/material/material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialService } from './materiales.service';
import { MaterialController } from './materiales.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), RolPermisoOpcionModule,],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}

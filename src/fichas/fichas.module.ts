// src/ficha/ficha.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ficha } from './entities/ficha.entity';
import { FichaService } from './fichas.service';
import { FichaController } from './fichas.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ficha]),RolPermisoOpcionModule],
  controllers: [FichaController],
  providers: [FichaService],
  exports: [FichaService],
})
export class FichaModule {}

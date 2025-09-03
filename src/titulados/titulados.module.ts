import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulado } from './entities/titulado.entity';
import { TituladoService } from './titulados.service';
import { TituladoController } from './titulados.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Titulado]),RolPermisoOpcionModule],
  controllers: [TituladoController],
  providers: [TituladoService],
  exports: [TituladoService],
})
export class TituladoModule {}

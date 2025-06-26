import { Module } from '@nestjs/common';
import { OpcionesService } from './opciones.service';
import { OpcionesController } from './opciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opcion } from './entities/opcion.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Opcion])],
  controllers: [OpcionesController],
  providers: [OpcionesService],
})
export class OpcionesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opcion } from './entities/opcion.entity';
import { OpcionesService } from './opciones.service';
import { OpcionesController } from './opciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Opcion])],
  controllers: [OpcionesController],
  providers: [OpcionesService],
  exports: [OpcionesService],
})
export class OpcionesModule {}

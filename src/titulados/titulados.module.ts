import { Module } from '@nestjs/common';
import { TituladosService } from './titulados.service';
import { TituladosController } from './titulados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulado } from './entities/titulado.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Titulado])],
  controllers: [TituladosController],
  providers: [TituladosService],
})
export class TituladosModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titulado } from './entities/titulado.entity';
import { TituladoService } from './titulados.service';
import { TituladoController } from './titulados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Titulado])],
  controllers: [TituladoController],
  providers: [TituladoService],
  exports: [TituladoService],
})
export class TituladoModule {}

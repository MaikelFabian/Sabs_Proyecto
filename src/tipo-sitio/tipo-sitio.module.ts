import { Module } from '@nestjs/common';
import { TipoSitioService } from './tipo-sitio.service';
import { TipoSitioController } from './tipo-sitio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipositio } from './entities/tipo-sitio.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tipositio])],
  controllers: [TipoSitioController],
  providers: [TipoSitioService],
})
export class TipoSitioModule {}

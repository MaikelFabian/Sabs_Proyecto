// src/tipositio/tipositio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSitio } from './entities/tipo-sitio.entity';
import { TipoSitioService } from './tipo-sitio.service';
import { TipoSitioController } from './tipo-sitio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSitio])],
  controllers: [TipoSitioController],
  providers: [TipoSitioService],
  exports: [TipoSitioService],
})
export class TipoSitioModule {}

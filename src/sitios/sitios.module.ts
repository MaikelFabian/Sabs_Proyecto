// src/sitio/sitio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sitio } from './entities/sitio.entity';
import { SitioService } from './sitios.service';
import { SitioController } from './sitios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sitio])],
  controllers: [SitioController],
  providers: [SitioService],
  exports: [SitioService],
})
export class SitioModule {}

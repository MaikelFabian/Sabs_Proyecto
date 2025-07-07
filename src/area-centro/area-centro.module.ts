// src/areacentro/areacentro.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaCentro } from './entities/area-centro.entity';
import { AreaCentroService } from './area-centro.service';
import { AreaCentroController } from './area-centro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AreaCentro])],
  controllers: [AreaCentroController],
  providers: [AreaCentroService],
  exports: [AreaCentroService],
})
export class AreaCentroModule {}

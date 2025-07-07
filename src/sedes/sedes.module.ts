// src/sede/sede.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sede } from './entities/sede.entity';
import { SedeService } from './sedes.service';
import { SedeController } from './sedes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sede])],
  controllers: [SedeController],
  providers: [SedeService],
  exports: [SedeService],
})
export class SedeModule {}

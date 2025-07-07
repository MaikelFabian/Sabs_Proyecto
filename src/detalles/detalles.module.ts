// src/detalles/detalles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detalles } from './entities/detalle.entity';
import { DetallesService } from './detalles.service';
import { DetallesController } from './detalles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Detalles])],
  controllers: [DetallesController],
  providers: [DetallesService],
  exports: [DetallesService],
})
export class DetallesModule {}

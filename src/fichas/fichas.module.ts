// src/ficha/ficha.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ficha } from './entities/ficha.entity';
import { FichaService } from './fichas.service';
import { FichaController } from './fichas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ficha])],
  controllers: [FichaController],
  providers: [FichaService],
  exports: [FichaService],
})
export class FichaModule {}

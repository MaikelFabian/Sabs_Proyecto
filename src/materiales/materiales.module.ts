// src/material/material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialService } from './materiales.service';
import { MaterialController } from './materiales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}

// src/categoria-material/categoria-material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaMaterial } from './entities/categoria-material.entity';
import { CategoriaMaterialService } from './categoria-material.service';
import { CategoriaMaterialController } from './categoria-material.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaMaterial])],
  controllers: [CategoriaMaterialController],
  providers: [CategoriaMaterialService],
  exports: [CategoriaMaterialService],
})
export class CategoriaMaterialModule {}

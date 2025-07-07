// src/tipo-material/tipo-material.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMaterial } from './entities/tipo-material.entity';
import { TipoMaterialService } from './tipo-material.service';
import { TipoMaterialController } from './tipo-material.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMaterial])],
  controllers: [TipoMaterialController],
  providers: [TipoMaterialService],
  exports: [TipoMaterialService],
})
export class TipoMaterialModule {}

import { Module } from '@nestjs/common';
import { TipoMaterialService } from './tipo-material.service';
import { TipoMaterialController } from './tipo-material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipomaterial } from './entities/tipo-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tipomaterial])],
  controllers: [TipoMaterialController],
  providers: [TipoMaterialService],
})
export class TipoMaterialModule {}

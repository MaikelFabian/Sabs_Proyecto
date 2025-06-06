import { Module } from '@nestjs/common';
import { CategoriaMaterialService } from './categoria-material.service';
import { CategoriaMaterialController } from './categoria-material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoriamaterial } from './entities/categoria-material.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Categoriamaterial])],
  controllers: [CategoriaMaterialController],
  providers: [CategoriaMaterialService],
})
export class CategoriaMaterialModule {}

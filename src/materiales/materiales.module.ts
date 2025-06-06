import { Module } from '@nestjs/common';
import { materialService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  controllers: [MaterialesController],
  providers: [materialService],
})
export class MaterialesModule {}

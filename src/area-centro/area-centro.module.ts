import { Module } from '@nestjs/common';
import { AreacentroService } from './area-centro.service';
import { AreaCentroController } from './area-centro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Areacentro } from './entities/area-centro.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Areacentro])],
  controllers: [AreaCentroController],
  providers: [AreacentroService],
})
export class AreaCentroModule {}

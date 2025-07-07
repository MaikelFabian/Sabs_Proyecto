import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';
import { MunicipioService } from './municipios.service';
import { MunicipioController } from './municipios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Municipio])],
  controllers: [MunicipioController],
  providers: [MunicipioService],
  exports: [MunicipioService],
})
export class MunicipioModule {}

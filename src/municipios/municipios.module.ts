import { Module } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { MunicipiosController } from './municipios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Municipio])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
})
export class MunicipiosModule {}

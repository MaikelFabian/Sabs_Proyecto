import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Centro } from './entities/centro.entity';
import { CentroService } from './centros.service';
import { CentroController } from './centros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Centro])],
  controllers: [CentroController],
  providers: [CentroService],
  exports: [CentroService],
})
export class CentroModule {}

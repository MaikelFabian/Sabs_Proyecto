import { Module } from '@nestjs/common';
import { CentrosService } from './centros.service';
import { CentrosController } from './centros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Centro } from './entities/centro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Centro])],
  controllers: [CentrosController],
  providers: [CentrosService],
})
export class CentrosModule {}

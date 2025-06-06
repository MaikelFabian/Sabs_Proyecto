import { Module } from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { DetallesController } from './detalles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detalles } from './entities/detalle.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Detalles])],
  controllers: [DetallesController],
  providers: [DetallesService],
})
export class DetallesModule {}

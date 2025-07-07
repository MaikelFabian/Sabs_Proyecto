import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { MovimientoService } from './movimientos.service';
import { MovimientoController } from './movimientos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento])],
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService],
})
export class MovimientoModule {}

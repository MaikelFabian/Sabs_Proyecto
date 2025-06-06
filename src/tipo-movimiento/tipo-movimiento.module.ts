import { Module } from '@nestjs/common';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { TipoMovimientoController } from './tipo-movimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipomovimiento } from './entities/tipo-movimiento.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Tipomovimiento])],
  controllers: [TipoMovimientoController],
  providers: [TipoMovimientoService],
})
export class TipoMovimientoModule {}

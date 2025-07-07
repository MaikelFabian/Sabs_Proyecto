import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMovimiento } from './entities/tipo-movimiento.entity';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { TipoMovimientoController } from './tipo-movimiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMovimiento])],
  controllers: [TipoMovimientoController],
  providers: [TipoMovimientoService],
  exports: [TipoMovimientoService],
})
export class TipoMovimientoModule {}

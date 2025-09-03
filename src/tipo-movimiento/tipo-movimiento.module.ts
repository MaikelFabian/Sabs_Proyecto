import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMovimiento } from './entities/tipo-movimiento.entity';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { TipoMovimientoController } from './tipo-movimiento.controller';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMovimiento]),RolPermisoOpcionModule],
  controllers: [TipoMovimientoController],
  providers: [TipoMovimientoService],
  exports: [TipoMovimientoService, TypeOrmModule],
})
export class TipoMovimientoModule {}

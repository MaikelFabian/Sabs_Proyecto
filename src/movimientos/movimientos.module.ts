import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { MovimientoService } from './movimientos.service';
import { MovimientoController } from './movimientos.controller';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitud.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movimiento,
      Material,
      TipoMovimiento,
      RolPermisoOpcion,
      Solicitud,
      Detalles,
    ]),
  ],
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService],
})
export class MovimientoModule {}

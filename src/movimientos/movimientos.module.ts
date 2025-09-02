import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { Detalle } from 'src/detalles/entities/detalle.entity';
import { StockModule } from 'src/stock/stock.module';
import { NotificationsModule } from '../notificaciones/notificaciones.module';
import { MaterialesModule } from '../materiales/materiales.module';
import { DetallesModule } from 'src/detalles/detalles.module';
import { Stock } from 'src/stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movimiento,
      Material,
      TipoMovimiento,
      RolPermisoOpcion,
      Persona,
      Sitio,
      Detalle,
      Stock,
    ]),
    StockModule,
    NotificationsModule, 
    MaterialesModule, 
    DetallesModule,
  ],
  controllers: [MovimientosController],
  providers: [MovimientosService],
  exports: [MovimientosService],
})
export class MovimientosModule {}

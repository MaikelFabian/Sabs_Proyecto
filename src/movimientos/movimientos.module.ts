import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { MovimientoService } from './movimientos.service';
import { MovimientoController } from './movimientos.controller';
import { Material } from 'src/materiales/entities/materiale.entity';
import { TipoMovimiento } from 'src/tipo-movimiento/entities/tipo-movimiento.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { StockModule } from 'src/stock/stock.module';
import { NotificationsModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movimiento,
      Material,
      TipoMovimiento,
      RolPermisoOpcion,
      Persona,        // ✅ AGREGADO: Necesario para PersonaRepository
      Sitio,          // ✅ AGREGADO: Necesario para SitioRepository
      Detalles,
    ]),
    StockModule,
    NotificationsModule, // Importar el módulo de notificaciones
  ],
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService],
})
export class MovimientosModule {}

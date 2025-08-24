import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      Detalles,
      Persona,
      Movimiento,
      RolPermisoOpcion,
    ]),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}

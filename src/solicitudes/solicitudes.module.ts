import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Detalles } from 'src/detalles/entities/detalle.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Movimiento } from 'src/movimientos/entities/movimiento.entity';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { RolPermisoOpcion } from 'src/rol-permiso-opcion/entities/rol-permiso-opcion.entity';
import { TipoMovimientoModule } from 'src/tipo-movimiento/tipo-movimiento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      Detalles,
      Persona,
      Material,
      Movimiento,
      RolPermisoOpcion,
    ]),
    TipoMovimientoModule, 
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}

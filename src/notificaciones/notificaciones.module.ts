import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { NotificationsCronService } from './notificaciones-cron.service';
import { Notificacion } from './entities/notificacion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsGateway } from './notificaciones.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, Persona, Material]),
    RolPermisoOpcionModule,
    JwtModule.register({
      secret: 'Sabs',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [NotificacionesController],
  providers: [
    NotificationsService,
    NotificationsCronService,
    NotificationsGateway,
  ],
  exports: [NotificationsService],
})
export class NotificacionesModule {}

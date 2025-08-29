import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notificaciones.service';
import { NotificationsController } from './notificaciones.controller';
import { NotificationsCronService } from './notificaciones-cron.service';
import { Notificacion } from './entities/notificacion.entity';
import { Persona } from 'src/personas/entities/persona.entity';
import { Material } from 'src/materiales/entities/materiale.entity';
import { RolPermisoOpcionModule } from 'src/rol-permiso-opcion/rol-permiso-opcion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, Persona, Material]),
    RolPermisoOpcionModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsCronService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
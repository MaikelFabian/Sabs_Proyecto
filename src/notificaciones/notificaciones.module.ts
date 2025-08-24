import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notificaciones.service';
import { NotificationsController } from './notificaciones.controller'
import { Notificacion } from './entities/notificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
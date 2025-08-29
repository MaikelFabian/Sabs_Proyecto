import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notificaciones.service';

@Injectable()
export class NotificationsCronService {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Ejecutar todos los días a las 8:00 AM
  @Cron('0 8 * * *')
  async handleCronNotificacionesCaducidad() {
    console.log('Ejecutando tarea programada: Notificaciones de caducidad');
    try {
      await this.notificationsService.crearNotificacionesCaducidad();
      console.log('Tarea de notificaciones de caducidad completada exitosamente');
    } catch (error) {
      console.error('Error en tarea programada de notificaciones de caducidad:', error);
    }
  }

  // También ejecutar cada 12 horas para materiales críticos
  @Cron('0 */12 * * *')
  async handleCronNotificacionesCriticas() {
    console.log('Ejecutando tarea programada: Notificaciones críticas de caducidad');
    try {
      await this.notificationsService.crearNotificacionesCaducidad();
      console.log('Tarea de notificaciones críticas completada exitosamente');
    } catch (error) {
      console.error('Error en tarea programada de notificaciones críticas:', error);
    }
  }
}
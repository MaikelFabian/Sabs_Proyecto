import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notificaciones.service';
import { Notificacion } from './entities/notificacion.entity';

@Controller('notificaciones')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('usuario/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Notificacion[]> {
    return this.notificationsService.findByUser(userId);
  }
}
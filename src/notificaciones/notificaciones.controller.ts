import { Controller, Get, Post, Patch, Param, ParseIntPipe, UseGuards, Body, BadRequestException, Query } from '@nestjs/common';
import { NotificationsService } from './notificaciones.service';
import { Notificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Cambiar de recibir userId por parámetro a usar el usuario autenticado
  @Get('mis-notificaciones')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_VERNOTIFICACIONES')
  async findMyNotifications(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tipo') tipo?: string,
    @Query('leida') leida?: 'true' | 'false',
  ) {
    const parsedPage = Math.max(parseInt(page ?? '1', 10), 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit ?? '20', 10), 1), 100);
    const filtros = {
      tipo,
      leida: typeof leida !== 'undefined' ? leida === 'true' : undefined,
    };
    return this.notificationsService.findByUser(user.sub, parsedPage, parsedLimit, filtros);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_VERNOTIFICACIONES')
  async getMyUnreadCount(@CurrentUser() user: any): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(user.sub);
    return { count };
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_NOTIFICACIONES')
  async create(@Body() dto: CreateNotificacionDto): Promise<Notificacion> {
    return this.notificationsService.create(dto);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_VERNOTIFICACIONES')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<Notificacion> {
    // Verificar que la notificación pertenece al usuario
    return this.notificationsService.markAsReadForUser(id, user.sub);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_VERNOTIFICACIONES')
  async markAllAsRead(@CurrentUser() user: any): Promise<{ message: string }> {
    await this.notificationsService.markAllAsRead(user.sub);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Post('generar-caducidad')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('GESTIONAR_NOTIFICACIONES')
  async generarNotificacionesCaducidad() {
    try {
      await this.notificationsService.crearNotificacionesCaducidad();
      return {
        message: 'Notificaciones de caducidad generadas exitosamente'
      };
    } catch (error) {
      throw new BadRequestException('Error al generar notificaciones de caducidad: ' + error.message);
    }
  }
}
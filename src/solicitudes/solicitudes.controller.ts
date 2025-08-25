import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

//@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  // Crear solicitud independiente
  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.service.create(dto);
  }

  // Obtener todas las solicitudes
  @Get()
  //@Roles('VER_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  // Obtener una solicitud específica
  @Get(':id')
  //@Roles('VER_SOLICITUD')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // Obtener resumen de solicitud
  @Get(':id/resumen')
  getResumen(@Param('id', ParseIntPipe) id: number) {
    return this.service.getResumenSolicitud(id);
  }

  // Actualizar estado de solicitud
  @Patch(':id')
  //@Roles('EDITAR_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSolicitudDto,
  ) {
    return this.service.updateEstado(id, dto.estado || 'PENDIENTE');
  }

  // Eliminar solicitud
  @Delete(':id')
  @Roles('ELIMINAR_SOLICITUDES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Aprobar solicitud
  @Post(':id/aprobar')
  //@Roles('APROBAR_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { aprobadorId: number }
  ) {
    return this.service.aprobar(id, dto.aprobadorId);
  }

  // Entregar solicitud
  @Post(':id/entregar')
  //@Roles('ENTREGAR_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  entregar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { encargadoId: number }
  ) {
    return this.service.entregar(id, dto.encargadoId);
  }

  // Devolver solicitud
  @Post(':id/devolver')
  //@Roles('DEVOLVER_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  devolver(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { encargadoId: number }
  ) {
    return this.service.devolver(id, dto.encargadoId);
  }

  // Rechazar solicitud
  @Post(':id/rechazar')
  //@Roles('RECHAZAR_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { aprobadorId: number }
  ) {
    return this.service.rechazar(id, dto.aprobadorId);
  }
}
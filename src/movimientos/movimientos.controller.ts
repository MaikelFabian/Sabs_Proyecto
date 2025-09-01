import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovimientoService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { AprobarMovimientoDto } from './dto/aprobar-movimiento.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('movimientos')
export class MovimientoController {
  constructor(private readonly service: MovimientoService) {}

  // Crear nueva solicitud de movimiento
  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_MOVIMIENTO')
  async create(@Body() dto: CreateMovimientoDto, @CurrentUser() user: any) {
    dto.solicitanteId = user.sub;
    return this.service.create(dto);
  }

  // Obtener movimientos pendientes del usuario como aprobador
  @Get('pendientes')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('APROBAR_MOVIMIENTOS')
  async findPendientes(@CurrentUser() user: any) {
    return this.service.findPendientesByAprobador(user.sub);
  }

  // Obtener solicitudes del usuario
  @Get('mis-solicitudes')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  async findMySolicitudes(@Query() filtros: any, @CurrentUser() user: any) {
    return this.service.findSolicitadosByUser(user.sub, filtros);
  }

  // ✅ NUEVA RUTA: Aprobar movimiento y cambiar estado del material
  @Patch(':id/aprobar/material/:materialId/estado/:estado')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('APROBAR_MOVIMIENTOS')
  async aprobarYCambiarEstadoMaterial(
    @Param('id') movimientoId: string,
    @Param('materialId') materialId: string,
    @Param('estado') estado: string,
    @Body() dto: AprobarMovimientoDto,
    @CurrentUser() user: any
  ) {
    const estadoBoolean = estado === 'true';
    return this.service.aprobarYCambiarEstadoMaterial(
      +movimientoId, 
      +materialId, 
      estadoBoolean, 
      dto, 
      user.sub
    );
  }

  // Aprobar o rechazar movimiento con validación de usuario
  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('APROBAR_MOVIMIENTOS')
  async aprobarRechazar(
    @Param('id') id: string,
    @Body() dto: AprobarMovimientoDto,
    @CurrentUser() user: any
  ) {
    return this.service.aprobarRechazarByUser(+id, dto, user.sub);
  }

  // Obtener movimiento específico
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOneByUser(+id, user.sub);
  }

  // Obtener todos los movimientos con filtros
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  async findAll(@Query() filtros: any, @CurrentUser() user: any) {
    return this.service.findByUser(user.sub, filtros);
  }
}

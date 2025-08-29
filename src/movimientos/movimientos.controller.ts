import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  BadRequestException,
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

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_MOVIMIENTO')
  create(@Body() dto: CreateMovimientoDto, @CurrentUser() user: any) {
    // Establecer automáticamente el solicitante como el usuario autenticado
    dto.solicitanteId = user.sub;
    return this.service.create(dto);
  }

  // NUEVOS ENDPOINTS CON FILTRADO POR USUARIO
  
  // Obtener movimientos pendientes donde el usuario es aprobador
  @Get('mis-pendientes')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findMyPendientes(@CurrentUser() user: any) {
    return this.service.findPendientesByAprobador(user.sub);
  }

  // Obtener movimientos solicitados por el usuario
  @Get('mis-solicitudes')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findMySolicitudes(@Query() filtros: any, @CurrentUser() user: any) {
    return this.service.findSolicitadosByUser(user.sub, filtros);
  }

  // Obtener todos los movimientos del usuario (como solicitante o aprobador)
  @Get('mis-movimientos')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findMyMovimientos(@Query() filtros: any, @CurrentUser() user: any) {
    return this.service.findByUser(user.sub, filtros);
  }

  // Aprobar/rechazar con validación de usuario
  @Patch(':id/aprobar-rechazar-seguro')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('APROBAR_MOVIMIENTOS')
  aprobarRechazarSeguro(
    @Param('id') id: string, 
    @Body() dto: AprobarMovimientoDto,
    @CurrentUser() user: any
  ) {
    return this.service.aprobarRechazarByUser(+id, dto, user.sub);
  }

  // Obtener movimiento específico del usuario
  @Get('mis-movimientos/:id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findMyMovimiento(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOneByUser(+id, user.sub);
  }

  // ENDPOINTS ORIGINALES (mantenidos para compatibilidad)
  
  // Aprobar o rechazar movimiento (método original)
  @Patch(':id/aprobar-rechazar')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('APROBAR_MOVIMIENTOS')
  aprobarRechazar(@Param('id') id: string, @Body() dto: AprobarMovimientoDto) {
    return this.service.aprobarRechazar(+id, dto);
  }

  @Get('pendientes')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findPendientes() {
    return this.service.findPendientes();
  }

  // Obtener todos los movimientos con filtros opcionales
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findAll(@Query() filtros?: any) {
    return this.service.findAll(filtros);
  }

  // Obtener un movimiento específico por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
}

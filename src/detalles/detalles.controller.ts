
import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@Controller('detalles')
export class DetallesController {
  constructor(private readonly service: DetallesService) {}

  // Obtener todos los detalles con filtros opcionales
  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_DETALLES')
  findAll(@Query() filtros?: any) {
    return this.service.findAll(filtros);
  }

  // Obtener detalles por estado
  @Get('estado/:estado')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_DETALLES')
  findByEstado(@Param('estado') estado: 'NO_APROBADO' | 'APROBADO' | 'RECHAZADO') {
    return this.service.findByEstado(estado);
  }

  // Obtener historial de movimientos de un material
  @Get('material/:materialId/historial')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_DETALLES')
  findHistorialMaterial(@Param('materialId') materialId: string) {
    return this.service.findHistorialMaterial(+materialId);
  }

  // Obtener detalles de un movimiento específico
  @Get('movimiento/:movimientoId')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_DETALLES')
  findByMovimiento(@Param('movimientoId') movimientoId: string) {
    return this.service.findByMovimiento(+movimientoId);
  }

  // Obtener estadísticas de detalles
  @Get('estadisticas')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_ESTADISTICAS')
  getEstadisticas() {
    return this.service.getEstadisticas();
  }

  // Obtener un detalle específico por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_DETALLE')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }
}


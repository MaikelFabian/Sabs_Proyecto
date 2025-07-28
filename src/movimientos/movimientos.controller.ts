import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovimientoService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { FiltrarMovimientosDto } from './dto/filtrar-movimientos.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('movimientos')
export class MovimientoController {
  constructor(private readonly service: MovimientoService) {}

  @Post()
  create(@Body() dto: CreateMovimientoDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MOVIMIENTOS')
  @Get('filtrar')
  async filtrar(@Query() dto: FiltrarMovimientosDto) {
    return this.service.filtrarMovimientos(dto);
  }

  @Get()
  @Roles('VER_MOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_MOVIMIENTO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_MOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateMovimientoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_MOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

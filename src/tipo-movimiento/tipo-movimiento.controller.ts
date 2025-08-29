import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';


@Controller('tipomovimientos')
export class TipoMovimientoController {
  constructor(private readonly service: TipoMovimientoService) {}

  @Post()
  @Roles('CREAR_TIPOMOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateTipoMovimientoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_TIPOMOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_TIPOMOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_TIPOMOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTipoMovimientoDto) {
    return this.service.update(+id, dto);
  }

  @Roles('ELIMINAR_TIPOMOVIMIENTOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

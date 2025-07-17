// src/detalles/detalles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { CreateDetallesDto } from './dto/create-detalle.dto';
import { UpdateDetallesDto } from './dto/update-detalle.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('detalles')
export class DetallesController {
  constructor(private readonly service: DetallesService) {}

  @Post()
  @Roles('CREAR_DETALLES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateDetallesDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_DETALLES')  
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_DETALLE')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_DETALLES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateDetallesDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_DETALLES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

// src/sitio/sitio.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SitioService } from './sitios.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('sitios')
export class SitioController {
  constructor(private readonly service: SitioService) {}

  @Post()
  @Roles('CREAR_SITIOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateSitioDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_SITIOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_SITIO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_SITIOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateSitioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_SITIOS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

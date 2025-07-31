// src/tipositio/tipositio.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoSitioService } from './tipo-sitio.service';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('tipositios')

@UseGuards(JwtAuthGuard, PermisosGuard)
export class TipoSitioController {
  constructor(private readonly service: TipoSitioService) {}

  @Post() 
  @Roles('CREAR_TIPOS DE SITIO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateTipoSitioDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_TIPOS DE SITIO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_TIPOS DE SITIO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_TIPOS DE SITIO')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTipoSitioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('ELIMINAR_TIPOS DE SITIO')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

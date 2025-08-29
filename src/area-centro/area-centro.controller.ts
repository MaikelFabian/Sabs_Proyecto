// src/areacentro/areacentro.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AreaCentroService } from './area-centro.service';
import { CreateAreaCentroDto } from './dto/create-area-centro.dto';
import { UpdateAreaCentroDto } from './dto/update-area-centro.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('areacentros')
export class AreaCentroController {
  constructor(private readonly service: AreaCentroService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_AREACENTROS')
  create(@Body() dto: CreateAreaCentroDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_AREACENTROS')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_AREACENTROS')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('EDITAR_AREACENTROS')
  update(@Param('id') id: string, @Body() dto: UpdateAreaCentroDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('ELIMINAR_AREACENTROS')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

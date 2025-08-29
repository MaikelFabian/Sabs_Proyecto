// src/ficha/ficha.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FichaService } from './fichas.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('fichas')
export class FichaController {
  constructor(private readonly service: FichaService) {}

  @Post()
  @Roles('CREAR_FICHAS')
  create(@Body() dto: CreateFichaDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_FICHAS')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_FICHA')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_FICHAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateFichaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_FICHAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

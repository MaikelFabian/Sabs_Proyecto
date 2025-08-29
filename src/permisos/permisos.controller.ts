import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Get('full')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERMISOS')
  getAllWithOpcionYModulo() {
    return this.permisosService.getAllWithOpcionYModulo();
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_PERMISOS')
  create(@Body() dto: CreatePermisoDto) {
    return this.permisosService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERMISOS')
  findAll() {
    return this.permisosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_PERMISOS')
  findOne(@Param('id') id: string) {
    return this.permisosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('EDITAR_PERMISOS')
  update(@Param('id') id: string, @Body() dto: UpdatePermisoDto) {
    return this.permisosService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('ELIMINAR_PERMISOS')
  remove(@Param('id') id: string) {
    return this.permisosService.remove(+id);
  }
}

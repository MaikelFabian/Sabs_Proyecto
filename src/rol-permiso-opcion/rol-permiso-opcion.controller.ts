import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { CreateRolPermisoOpcionDto } from './dto/create-rol-permiso-opcion.dto';
import { UpdateRolPermisoOpcionDto } from './dto/update-rol-permiso-opcion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('rol-permiso-opcion')
export class RolPermisoOpcionController {
  constructor(private readonly service: RolPermisoOpcionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateRolPermisoOpcionDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get('permisos-disponibles')
  @UseGuards(JwtAuthGuard)
  findAllPermisosDisponibles() {
    return this.service.findAllPermisosDisponibles();
  }

  @Get('permisos-disponibles/:rolId')
  @UseGuards(JwtAuthGuard)
  findAllPermisosDisponiblesConRol(@Param('rolId', ParseIntPipe) rolId: number) {
    return this.service.findAllPermisosDisponibles(rolId);
  }

  @Get('rol/:rolId')
  @UseGuards(JwtAuthGuard)
  findPermisosByRol(@Param('rolId', ParseIntPipe) rolId: number) {
    return this.service.findPermisosByRol(rolId);
  }

  @Post('asignar-permisos/:rolId')
  @UseGuards(JwtAuthGuard)
  asignarPermisosARol(
    @Param('rolId', ParseIntPipe) rolId: number,
    @Body() permisosData: { permisoId: number, opcionId?: number }[]
  ) {
    return this.service.asignarPermisosARol(rolId, permisosData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolPermisoOpcionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

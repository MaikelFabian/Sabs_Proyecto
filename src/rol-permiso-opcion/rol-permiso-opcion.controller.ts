import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { CreateRolPermisoOpcionDto } from './dto/create-rol-permiso-opcion.dto';
import { UpdateRolPermisoOpcionDto } from './dto/update-rol-permiso-opcion.dto';

@Controller('rol-permiso-opcion')
export class RolPermisoOpcionController {
  constructor(private readonly service: RolPermisoOpcionService) {}

  @Post()
  create(@Body() dto: CreateRolPermisoOpcionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }


  @Get('permisos-disponibles')
  findAllPermisosDisponibles() {
    return this.service.findAllPermisosDisponibles();
  }

  @Get('rol/:rolId')
  findPermisosByRol(@Param('rolId', ParseIntPipe) rolId: number) {
    return this.service.findPermisosByRol(rolId);
  }

  @Post('asignar-permisos/:rolId')
  asignarPermisosARol(
    @Param('rolId', ParseIntPipe) rolId: number,
    @Body() permisosData: { permisoId: number, opcionId?: number }[]
  ) {
    return this.service.asignarPermisosARol(rolId, permisosData);
  }

  // RUTAS DINÁMICAS AL FINAL
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolPermisoOpcionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

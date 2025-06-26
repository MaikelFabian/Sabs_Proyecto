import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolPermisoOpcionService } from './rol-permiso-opcion.service';
import { CreateRolPermisoOpcionDto } from './dto/create-rol-permiso-opcion.dto';
import { UpdateRolPermisoOpcionDto } from './dto/update-rol-permiso-opcion.dto';

@Controller('rol-permiso-opcion')
export class RolPermisoOpcionController {
  constructor(private readonly rolPermisoOpcionService: RolPermisoOpcionService) {}

  @Post()
  create(@Body() createRolPermisoOpcionDto: CreateRolPermisoOpcionDto) {
    return this.rolPermisoOpcionService.create(createRolPermisoOpcionDto);
  }

  @Get()
  findAll() {
    return this.rolPermisoOpcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolPermisoOpcionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolPermisoOpcionDto: UpdateRolPermisoOpcionDto) {
    return this.rolPermisoOpcionService.update(+id, updateRolPermisoOpcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolPermisoOpcionService.remove(+id);
  }
}

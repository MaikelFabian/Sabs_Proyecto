import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Permiso } from './entities/permiso.entity';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  create(@Body() data: Partial<Permiso>) {
    return this.permisosService.create(data);
  }

  @Get()
  findAll() {
    return this.permisosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permisosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Permiso>) {
    return this.permisosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permisosService.remove(+id);
  }
}

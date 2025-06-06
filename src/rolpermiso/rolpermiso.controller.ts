import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolpermisoService } from './rolpermiso.service';
import { CreateRolpermisoDto } from './dto/create-rolpermiso.dto';
import { UpdateRolpermisoDto } from './dto/update-rolpermiso.dto';
import { Rolpermiso } from './entities/rolpermiso.entity';

@Controller('rolpermiso')
export class RolpermisoController {
  constructor(private readonly rolpermisoService: RolpermisoService) {}

  @Post()
  create(@Body() data:Partial<Rolpermiso>) {
    return this.rolpermisoService.create(data);
  }

  @Get()
  findAll() {
    return this.rolpermisoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolpermisoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Rolpermiso>) {
    return this.rolpermisoService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolpermisoService.remove(+id);
  }
}

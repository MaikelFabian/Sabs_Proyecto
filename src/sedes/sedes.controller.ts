import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SedeService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('sedes')
export class SedeController {
  constructor(private readonly service: SedeService) {}

  @Post()
  @Roles('CREAR_SEDES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateSedeDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_SEDES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_SEDE')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id') 
  @Roles('EDITAR_SEDES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateSedeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_SEDES')  
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpcionesService } from './opciones.service';
import { CreateOpcionDto } from './dto/create-opcione.dto';
import { UpdateOpcionDto } from './dto/update-opcione.dto';

@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}


  @Get('full')
  getAllWithPermisos() {
    return this.opcionesService.getAllWithPermisos();
  }

  @Post()
  create(@Body() dto: CreateOpcionDto) {
    return this.opcionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.opcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.opcionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOpcionDto) {
    return this.opcionesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opcionesService.remove(+id);
  }
}

// src/detalles/detalles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { CreateDetallesDto } from './dto/create-detalle.dto';
import { UpdateDetallesDto } from './dto/update-detalle.dto';

@Controller('detalles')
export class DetallesController {
  constructor(private readonly service: DetallesService) {}

  @Post()
  create(@Body() dto: CreateDetallesDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDetallesDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

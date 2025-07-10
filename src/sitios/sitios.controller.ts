// src/sitio/sitio.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SitioService } from './sitios.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Controller('sitios')
export class SitioController {
  constructor(private readonly service: SitioService) {}

  @Post()
  create(@Body() dto: CreateSitioDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSitioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

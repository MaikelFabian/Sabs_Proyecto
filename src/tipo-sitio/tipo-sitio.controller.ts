// src/tipositio/tipositio.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSitioService } from './tipo-sitio.service';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';

@Controller('tipositios')
export class TipoSitioController {
  constructor(private readonly service: TipoSitioService) {}

  @Post()
  create(@Body() dto: CreateTipoSitioDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateTipoSitioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

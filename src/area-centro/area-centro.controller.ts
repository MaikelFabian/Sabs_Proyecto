// src/areacentro/areacentro.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreaCentroService } from './area-centro.service';
import { CreateAreaCentroDto } from './dto/create-area-centro.dto';
import { UpdateAreaCentroDto } from './dto/update-area-centro.dto';

@Controller('areacentro')
export class AreaCentroController {
  constructor(private readonly service: AreaCentroService) {}

  @Post()
  create(@Body() dto: CreateAreaCentroDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAreaCentroDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

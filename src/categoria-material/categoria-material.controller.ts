// src/categoria-material/categoria-material.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaMaterialService } from './categoria-material.service';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';

@Controller('categoriamateriales')
export class CategoriaMaterialController {
  constructor(private readonly service: CategoriaMaterialService) {}

  @Post()
  create(@Body() dto: CreateCategoriaMaterialDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaMaterialDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

// src/categoria-material/categoria-material.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriaMaterialService } from './categoria-material.service';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('categoriamateriales')
export class CategoriaMaterialController {
  constructor(private readonly service: CategoriaMaterialService) {}

  @Post()
  @UseGuards(JwtAuthGuard )
  create(@Body() dto: CreateCategoriaMaterialDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard )
  
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard )
  
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard )

  update(@Param('id') id: string, @Body() dto: UpdateCategoriaMaterialDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard )

  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

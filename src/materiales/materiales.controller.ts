// src/material/material.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaterialService } from './materiales.service';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('materiales')
@UseGuards(LocalAuthGuard, PermisosGuard)
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  create(@Body() dto: CreateMaterialDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

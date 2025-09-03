// src/tipo-material/tipo-material.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoMaterialService } from './tipo-material.service';
import { CreateTipoMaterialDto } from './dto/create-tipo-material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo-material.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



@Controller('tipomateriales')
export class TipoMaterialController {
  constructor(private readonly service: TipoMaterialService) {}

  @Post()
  @UseGuards(JwtAuthGuard, )

  create(@Body() dto: CreateTipoMaterialDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, )

  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, )

  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, )

  update(@Param('id') id: string, @Body() dto: UpdateTipoMaterialDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, )

  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

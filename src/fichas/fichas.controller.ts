// src/ficha/ficha.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FichaService } from './fichas.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('fichas')
@UseGuards(LocalAuthGuard, PermisosGuard)
export class FichaController {
  constructor(private readonly service: FichaService) {}

  @Post()
  create(@Body() dto: CreateFichaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFichaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

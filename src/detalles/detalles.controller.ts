// src/detalles/detalles.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { DetallesService } from './detalles.service';

@Controller('detalles')
export class DetallesController {
  constructor(private readonly detallesService: DetallesService) {}

  @Post()
  async create(@Body() dto: {
    movimientoId: number;
    materialId: number;
    cantidad: number;
    personaSolicitaId?: number;
  }) {
    return this.detallesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.detallesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.detallesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: any) {
    return this.detallesService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.detallesService.remove(+id);
  }
}

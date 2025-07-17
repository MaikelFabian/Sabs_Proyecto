// src/material/material.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MaterialService } from './materiales.service';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('materiales')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREATE_MATERIALES')
  create(@Body() dto: CreateMaterialDto) {
    console.log('⚡️ Entró a MaterialController.create');
    return this.service.create(dto);
  }

  @Get('stock')
  @Roles('VER_STOCK')
  async getStock() {
    return this.service.obtenerStockCompleto();
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

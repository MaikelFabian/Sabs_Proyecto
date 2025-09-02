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
  BadRequestException,
  Query,
  ParseIntPipe, 
} from '@nestjs/common';
import { MaterialService } from './materiales.service';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
@Controller('materiales')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() dto: CreateMaterialDto) {
    return this.materialService.create(dto);
  }

  @Get()
  async findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaterialDto) {
    return this.materialService.update(id, dto);
  }

  @Get(':id/movimientos')
  async getMovimientos(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.getMovimientosPorMaterial(id);
  }

  @Get(':id/saldo')
  async getSaldo(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.getSaldoPendiente(id);
  }
}

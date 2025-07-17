// src/area/area.controller.ts
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
import { AreaService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('areas')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @Post()
  @Roles('CREAR_AREAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  create(@Body() dto: CreateAreaDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('VER_AREAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('VER_AREA')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_AREAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateAreaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_AREAS')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TituladosService } from './titulados.service';
import { Titulado } from './entities/titulado.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('titulados')
export class TituladosController {
  constructor(private readonly tituladosService: TituladosService) {}

  @Post()
  create(@Body() data: Partial<Titulado>, @Request() req) {
    return this.tituladosService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.tituladosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tituladosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Titulado>, @Request() req) {
    return this.tituladosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tituladosService.remove(+id);
  }
}
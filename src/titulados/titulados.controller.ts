import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TituladosService } from './titulados.service';
import { CreateTituladoDto } from './dto/create-titulado.dto';
import { UpdateTituladoDto } from './dto/update-titulado.dto';
import { Titulado } from './entities/titulado.entity';

@Controller('titulados')
export class TituladosController {
  constructor(private readonly tituladosService: TituladosService) {}

  @Post()
  create(@Body() data: Partial<Titulado>) {
    return this.tituladosService.create(data);
  }

  @Get()
  findAll() {
    return this.tituladosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tituladosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data:Partial<Titulado>) {
    return this.tituladosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tituladosService.remove(+id);
  }
}

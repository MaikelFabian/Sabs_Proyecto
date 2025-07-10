
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TituladoService } from './titulados.service';
import { CreateTituladoDto } from './dto/create-titulado.dto';
import { UpdateTituladoDto } from './dto/update-titulado.dto';

@Controller('titulados')
export class TituladoController {
  constructor(private readonly service: TituladoService) {}

  @Post()
  create(@Body() dto: CreateTituladoDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateTituladoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

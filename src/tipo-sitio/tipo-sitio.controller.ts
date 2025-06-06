import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSitioService } from './tipo-sitio.service';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';
import { Tipositio } from './entities/tipo-sitio.entity';

@Controller('tipo-sitio')
export class TipoSitioController {
  constructor(private readonly tipoSitioService: TipoSitioService) {}

  @Post()
  create(@Body() data: Partial<Tipositio>) {
    return this.tipoSitioService.create(data);
  }

  @Get()
  findAll() {
    return this.tipoSitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoSitioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data:Partial<Tipositio>) {
    return this.tipoSitioService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoSitioService.remove(+id);
  }
}

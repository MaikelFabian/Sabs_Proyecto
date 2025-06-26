import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreacentroService } from './area-centro.service';
import { Areacentro } from './entities/area-centro.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('area-centro')

export class AreaCentroController {
  constructor(private readonly areaCentroService: AreacentroService) {}

  @Post()
  create(@Body() data: Partial<Areacentro>) {
    return this.areaCentroService.create(data);
  }

  @Get()
  findAll() {
    return this.areaCentroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaCentroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Areacentro>) {
    return this.areaCentroService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areaCentroService.remove(+id);
  }
}

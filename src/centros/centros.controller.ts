import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CentroService } from './centros.service';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';

@Controller('centros')
export class CentroController {
  constructor(private readonly service: CentroService) {}

  @Post()
  create(@Body() dto: CreateCentroDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCentroDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

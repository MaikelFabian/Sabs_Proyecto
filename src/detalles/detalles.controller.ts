import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { CreateDetalleDto } from './dto/create-detalle.dto';
import { UpdateDetalleDto } from './dto/update-detalle.dto';
import { Detalles } from './entities/detalle.entity';

@Controller('detalles')
export class DetallesController {
  constructor(private readonly detallesService: DetallesService) {}

  @Post()
  create(@Body() data: Partial <Detalles>) {
    return this.detallesService.create(data);
  }

  @Get()
  findAll() {
    return this.detallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial <Detalles>) {
    return this.detallesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnidadMedidaService } from './unidad-medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { Unidadmedida } from './entities/unidad-medida.entity';

@Controller('unidad-medida')
export class UnidadMedidaController {
  constructor(private readonly unidadMedidaService: UnidadMedidaService) {}

  @Post()
  create(@Body() data:Partial<Unidadmedida>) {
    return this.unidadMedidaService.create(data);
  }

  @Get()
  findAll() {
    return this.unidadMedidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadMedidaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Unidadmedida>) {
    return this.unidadMedidaService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadMedidaService.remove(+id);
  }
}

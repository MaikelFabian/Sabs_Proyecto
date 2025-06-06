import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMovimientoService } from './tipo-movimiento.service';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';
import { Tipomovimiento } from './entities/tipo-movimiento.entity';

@Controller('tipo-movimiento')
export class TipoMovimientoController {
  constructor(private readonly tipoMovimientoService: TipoMovimientoService) {}

  @Post()
  create(@Body() data:Partial<Tipomovimiento>) {
    return this.tipoMovimientoService.create(data);
  }

  @Get()
  findAll() {
    return this.tipoMovimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMovimientoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data:Partial<Tipomovimiento>) {
    return this.tipoMovimientoService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMovimientoService.remove(+id);
  }
}

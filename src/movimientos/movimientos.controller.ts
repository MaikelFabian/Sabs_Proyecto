import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimiento } from './entities/movimiento.entity';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  create(@Body() data: Partial<Movimiento>) {
    return this.movimientosService.create(data);
  }

  @Get()
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Movimiento>) {
    return this.movimientosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id);
  }
}

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
import { TipoMovimientoService } from './tipo-movimiento.service';
import { Tipomovimiento } from './entities/tipo-movimiento.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tipo-movimiento')
export class TipoMovimientoController {
  constructor(private readonly tipoMovimientoService: TipoMovimientoService) {}

  @Post()
  create(@Body() data: Partial<Tipomovimiento>, @Request() req) {
    return this.tipoMovimientoService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.tipoMovimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tipoMovimientoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Tipomovimiento>, @Request() req) {
    return this.tipoMovimientoService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tipoMovimientoService.remove(+id);
  }
}

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
import { UnidadMedidaService } from './unidad-medida.service';
import { Unidadmedida } from './entities/unidad-medida.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('unidad-medida')
export class UnidadMedidaController {
  constructor(private readonly unidadMedidaService: UnidadMedidaService) {}

  @Post()
  create(@Body() data: Partial<Unidadmedida>, @Request() req) {
    return this.unidadMedidaService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.unidadMedidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.unidadMedidaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Unidadmedida>, @Request() req) {
    return this.unidadMedidaService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.unidadMedidaService.remove(+id);
  }
}

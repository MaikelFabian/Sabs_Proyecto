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
import { TipoSitioService } from './tipo-sitio.service';
import { Tipositio } from './entities/tipo-sitio.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tipo-sitio')
export class TipoSitioController {
  constructor(private readonly tipoSitioService: TipoSitioService) {}

  @Post()
  create(@Body() data: Partial<Tipositio>, @Request() req) {
    return this.tipoSitioService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.tipoSitioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tipoSitioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Tipositio>, @Request() req) {
    return this.tipoSitioService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tipoSitioService.remove(+id);
  }
}
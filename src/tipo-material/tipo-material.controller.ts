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
import { TipoMaterialService } from './tipo-material.service';
import { Tipomaterial } from './entities/tipo-material.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) 

@Controller('tipo-material')
export class TipoMaterialController {
  constructor(private readonly tipoMaterialService: TipoMaterialService) {}

  @Post()
  create(@Body() data: Partial<Tipomaterial>, @Request() req) {
    return this.tipoMaterialService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.tipoMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tipoMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<Tipomaterial>,
    @Request() req,
  ) {
    return this.tipoMaterialService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tipoMaterialService.remove(+id);
  }
}
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
import { OpcionesService } from './opciones.service';
import { CreateOpcioneDto } from './dto/create-opcione.dto';
import { UpdateOpcioneDto } from './dto/update-opcione.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}

  @Post()
  create(@Body() createOpcioneDto: CreateOpcioneDto, @Request() req) {
    return this.opcionesService.create(createOpcioneDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.opcionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.opcionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpcioneDto: UpdateOpcioneDto, @Request() req) {
    return this.opcionesService.update(+id, updateOpcioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.opcionesService.remove(+id);
  }
}

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
import { AreacentroService } from './area-centro.service';
import { Areacentro } from './entities/area-centro.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('area-centro')
export class AreaCentroController {
  constructor(private readonly areaCentroService: AreacentroService) {}

  @Post()
  create(@Body() data: Partial<Areacentro>, @Request() req) {
    return this.areaCentroService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.areaCentroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.areaCentroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Areacentro>, @Request() req) {
    return this.areaCentroService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.areaCentroService.remove(+id);
  }
}
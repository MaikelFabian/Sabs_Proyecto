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
import { CategoriaMaterialService } from './categoria-material.service';
import { Categoriamaterial } from './entities/categoria-material.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categoria-material')
export class CategoriaMaterialController {
  constructor(private readonly categoriaMaterialService: CategoriaMaterialService) {}

  @Post()
  create(@Body() data: Partial<Categoriamaterial>, @Request() req) {
    return this.categoriaMaterialService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.categoriaMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.categoriaMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Categoriamaterial>, @Request() req) {
    return this.categoriaMaterialService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoriaMaterialService.remove(+id);
  }
}
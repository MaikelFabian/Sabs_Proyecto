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
import { DetallesService } from './detalles.service';
import { Detalles } from './entities/detalle.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('detalles')
export class DetallesController {
  constructor(private readonly detallesService: DetallesService) {}

  @Post()
  create(@Body() data: Partial<Detalles>, @Request() req) {
    return this.detallesService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.detallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.detallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Detalles>, @Request() req) {
    return this.detallesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.detallesService.remove(+id);
  }
}

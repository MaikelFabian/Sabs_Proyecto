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
import { AreasService } from './areas.service';
import { Area } from './entities/area.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() data: Partial<Area>, @Request() req) {
    return this.areasService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.areasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Area>, @Request() req) {
    return this.areasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.areasService.remove(+id);
  }
}
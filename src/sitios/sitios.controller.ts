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
import { SitiosService } from './sitios.service';
import { Sitio } from './entities/sitio.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sitios')
export class SitiosController {
  constructor(private readonly sitiosService: SitiosService) {}

  @Post()
  create(@Body() data: Partial<Sitio>, @Request() req) {
    return this.sitiosService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.sitiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.sitiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Sitio>, @Request() req) {
    return this.sitiosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.sitiosService.remove(+id);
  }
}

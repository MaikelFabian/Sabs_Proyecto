import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SitiosService } from './sitios.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';
import { Sitio } from './entities/sitio.entity';

@Controller('sitios')
export class SitiosController {
  constructor(private readonly sitiosService: SitiosService) {}

  @Post()
  create(@Body() data: Partial<Sitio>) {
    return this.sitiosService.create(data);
  }

  @Get()
  findAll() {
    return this.sitiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data:Partial<Sitio>) {
    return this.sitiosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitiosService.remove(+id);
  }
}

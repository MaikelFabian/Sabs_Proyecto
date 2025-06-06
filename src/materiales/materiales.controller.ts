import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { materialService } from './materiales.service';
import { Material } from './entities/materiale.entity';

@Controller('elementos')
export class MaterialesController {
  constructor(private readonly materialService: materialService) {}

  @Post()
  create(@Body() data: Partial<Material>) {
    return this.materialService.create(data);
  }

  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.materialService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Material>) {
    return this.materialService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.materialService.remove(+id);
  }
}
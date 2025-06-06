import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaMaterialService } from './categoria-material.service';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';
import { Categoriamaterial } from './entities/categoria-material.entity';

@Controller('categoria-material')
export class CategoriaMaterialController {
  constructor(private readonly categoriaMaterialService: CategoriaMaterialService) {}

  @Post()
  create(@Body() data: Partial <Categoriamaterial>) {
    return this.categoriaMaterialService.create(data);
  }

  @Get()
  findAll() {
    return this.categoriaMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial <Categoriamaterial>) {
    return this.categoriaMaterialService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaMaterialService.remove(+id);
  }
}

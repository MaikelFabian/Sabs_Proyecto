import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMaterialService } from './tipo-material.service';
import { CreateTipoMaterialDto } from './dto/create-tipo-material.dto';
import { UpdateTipoMaterialDto } from './dto/update-tipo-material.dto';
import { Tipomaterial } from './entities/tipo-material.entity';

@Controller('tipo-material')
export class TipoMaterialController {
  constructor(private readonly tipoMaterialService: TipoMaterialService) {}

  @Post()
  create(@Body() data: Partial<Tipomaterial>) {
    return this.tipoMaterialService.create(data);
  }

  @Get()
  findAll() {
    return this.tipoMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Tipomaterial>) {
    return this.tipoMaterialService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMaterialService.remove(+id);
  }
}

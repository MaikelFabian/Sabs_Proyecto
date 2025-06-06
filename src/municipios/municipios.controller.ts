import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { Municipio } from './entities/municipio.entity';

@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  create(@Body() data: Partial<Municipio>) {
    return this.municipiosService.create(data);
  }

  @Get()
  findAll() {
    return this.municipiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.municipiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()data: Partial<Municipio>) {
    return this.municipiosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.municipiosService.remove(+id);
  }
}

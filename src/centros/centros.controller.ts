import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CentrosService } from './centros.service';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';
import { Centro } from './entities/centro.entity';

@Controller('centros')
export class CentrosController {
  constructor(private readonly centrosService: CentrosService) {}

  @Post()
  create(@Body() data : Partial<Centro>) {
    return this.centrosService.create(data);
  }

  @Get()
  findAll() {
    return this.centrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.centrosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()data : Partial <Centro>) {
    return this.centrosService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centrosService.remove(+id);
  }
}

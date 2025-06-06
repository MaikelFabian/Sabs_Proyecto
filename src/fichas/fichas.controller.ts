import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';
import { Ficha } from './entities/ficha.entity';

@Controller('fichas')
export class FichasController {
  constructor(private readonly fichasService: FichasService) {}

  @Post()
  create(@Body() data : Partial <Ficha>) {
    return this.fichasService.create(data);
  }

  @Get()
  findAll() {
    return this.fichasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Ficha>) {
    return this.fichasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichasService.remove(+id);
  }
}

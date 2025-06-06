import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { Sede } from './entities/sede.entity';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  create(@Body() data: Partial<Sede>) {
    return this.sedesService.create(data);
  }

  @Get()
  findAll() {
    return this.sedesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sedesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Sede>) {
    return this.sedesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sedesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() data: Partial<Area>) {
    return this.areasService.create(data);
  }

  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial <Area>) {
    return this.areasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}

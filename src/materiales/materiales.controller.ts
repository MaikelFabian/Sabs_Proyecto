import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { materialService } from './materiales.service';
import { Material } from './entities/materiale.entity';
import { UpdateStockDto } from './dto/update-materiale.dto';

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

  @Put(':id/stock')
  async update(@Param('id') id: number, @Body() updateStockDto: UpdateStockDto): Promise<Material> {
    return this.materialService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.materialService.remove(+id);
  }
}
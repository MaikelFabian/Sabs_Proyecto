import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { materialService } from './materiales.service';
import { Material } from './entities/materiale.entity';
import { UpdateStockDto } from './dto/update-materiale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('elementos')
export class MaterialesController {
  constructor(private readonly materialService: materialService) {}

  @Post()
  create(@Body() data: Partial<Material>, @Request() req) {
    return this.materialService.create(data);
  }

  @Get()
  findAll(@Request() req) {
    return this.materialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    return this.materialService.findOne(+id);
  }

  @Put(':id/stock')
  async update(@Param('id') id: number, @Body() updateStockDto: UpdateStockDto, @Request() req): Promise<Material> {
    return this.materialService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.materialService.remove(+id);
  }
}

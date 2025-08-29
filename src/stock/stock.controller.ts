import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @Roles('CREAR_MATERIALES')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @Roles('VER_MATERIALES')
  findAll() {
    return this.stockService.findAll();
  }

  @Get('material/:materialId')
  @Roles('VER_MATERIALES')
  findByMaterial(@Param('materialId') materialId: string) {
    return this.stockService.findByMaterial(+materialId);
  }

  @Get('material/:materialId/total')
  @Roles('VER_MATERIALES')
  getTotalActiveStock(@Param('materialId') materialId: string) {
    return this.stockService.getTotalActiveStock(+materialId);
  }

  @Get(':id')
  @Roles('VER_MATERIALES')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_MATERIALES')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Patch(':id/activar')
  @Roles('EDITAR_MATERIALES')
  activar(@Param('id') id: string) {
    return this.stockService.activar(+id);
  }

  @Patch(':id/desactivar')
  @Roles('EDITAR_MATERIALES')
  desactivar(@Param('id') id: string) {
    return this.stockService.desactivar(+id);
  }

  @Delete(':id')
  @Roles('ELIMINAR_MATERIALES')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }

  // Nuevos endpoints con filtrado por usuario
  @Get('mis-stocks')
  @Roles('VER_MATERIALES')
  findMyStocks(@CurrentUser() user: any) {
    return this.stockService.findAllByUser(user.sub);
  }
  
  @Get('mis-stocks/material/:materialId')
  @Roles('VER_MATERIALES')
  findMyStocksByMaterial(@Param('materialId') materialId: string, @CurrentUser() user: any) {
    return this.stockService.findByMaterialAndUser(+materialId, user.sub);
  }
  
  @Get('mis-stocks/:id')
  @Roles('VER_MATERIALES')
  findMyStock(@Param('id') id: string, @CurrentUser() user: any) {
    return this.stockService.findOneByUser(+id, user.sub);
  }
}
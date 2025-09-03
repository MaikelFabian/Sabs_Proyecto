import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('stock')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @Roles('CREAR_STOCK')
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @Roles('VER_STOCK')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? Math.max(1, parseInt(page)) : 1;
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit))) : 50;
    return this.stockService.findAll(pageNum, limitNum);
  }

  // 🔧 CORREGIDO: Solo una implementación de findMyStocks
  @Get('mis-stocks')
  @Roles('VER_GESTIONDESTOCK')
  findMyStocks(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? Math.max(1, parseInt(page)) : 1;
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit))) : 50;
    return this.stockService.findAllByUser(user.sub, pageNum, limitNum);
  }

  @Get('material/:materialId')
  @Roles('VER_STOCK')
  findByMaterial(@Param('materialId') materialId: string) {
    return this.stockService.findByMaterial(+materialId);
  }

  @Get('material/:materialId/total')
  @Roles('VER_STOCK')
  getTotalActiveStock(@Param('materialId') materialId: string) {
    return this.stockService.getTotalActiveStock(+materialId);
  }

  @Get('mis-stocks/material/:materialId')
  @Roles('VER_GESTIONDESTOCK')
  findMyStocksByMaterial(
    @Param('materialId') materialId: string,
    @CurrentUser() user: any,
  ) {
    return this.stockService.findByMaterialAndUser(+materialId, user.sub);
  }

  @Get('mis-stocks/:id')
  @Roles('VER_GESTIONDESTOCK')
  findMyStock(@Param('id') id: string, @CurrentUser() user: any) {
    return this.stockService.findOneByUser(+id, user.sub);
  }

  @Get(':id')
  @Roles('VER_STOCK')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_STOCK')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Patch(':id/activar')
  @Roles('EDITAR_STOCK')
  activar(@Param('id') id: string) {
    return this.stockService.activar(+id);
  }

  @Patch(':id/desactivar')
  @Roles('EDITAR_STOCK')
  desactivar(@Param('id') id: string) {
    return this.stockService.desactivar(+id);
  }

  @Delete(':id')
  @Roles('ELIMINAR_GESTIONDESTOCK')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }
}

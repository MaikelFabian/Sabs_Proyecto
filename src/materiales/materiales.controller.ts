// src/material/material.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query, 
} from '@nestjs/common';
import { MaterialService } from './materiales.service';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('materiales')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_MATERIALES')
  create(@Body() dto: CreateMaterialDto) {
    console.log('⚡️ Entró a MaterialController.create');
    return this.service.create(dto);
  }

  @Get('stock')
  @Roles('VER_MATERIALES')
  async getStock() {
    return this.service.obtenerStockCompleto();
  }

  // Mover estos endpoints específicos ANTES del genérico :id
  @Get('mis-materiales')
  @Roles('VER_MATERIALES')
  findMyMaterials(@CurrentUser() user: any) {
    return this.service.findByUserSite(user.sub);
  }
  
  @Get('mis-materiales/stock')
  @Roles('VER_MATERIALES')
  getMyStock(@CurrentUser() user: any) {
    return this.service.obtenerStockCompletoByUser(user.sub);
  }
  
  // ✅ MOVER AQUÍ - antes del endpoint genérico :id
  @Get('mis-materiales/prestados-pendientes')
  @Roles('VER_MATERIALES')
  findMyMaterialesPrestadosPendientes(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    
    // Validar parámetros
    if (pageNum < 1) {
      throw new BadRequestException('La página debe ser mayor a 0');
    }
    if (limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }
    
    return this.service.findMaterialesPrestadosConSaldoPendiente(user.sub, pageNum, limitNum);
  }
  
  @Get('mis-materiales/:id')
  @Roles('VER_MATERIALES')
  findMyMaterial(@Param('id') id: string, @CurrentUser() user: any) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('ID debe ser un número válido mayor a 0');
    }
    return this.service.findOneByUser(numericId, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_MATERIALES')
  findAll() {
    return this.service.findAll();
  }

  // Ahora el endpoint genérico :id va después de los específicos
  @Get(':id')
  @Roles('VER_MATERIALES')
  findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('ID debe ser un número válido mayor a 0');
    }
    return this.service.findOne(numericId);
  }

  @Patch(':id')
  @Roles('EDITAR_MATERIALES')
  update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('ID debe ser un número válido mayor a 0');
    }
    return this.service.update(numericId, dto);
  }

  @Delete(':id')
  @Roles('ELIMINAR_MATERIALES')
  remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException('ID debe ser un número válido mayor a 0');
    }
    return this.service.remove(numericId);
  }

  // }
}

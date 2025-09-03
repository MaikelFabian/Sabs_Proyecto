
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UnidadMedidaService } from './unidad-medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('unidadmedidas')
export class UnidadMedidaController {
  constructor(private readonly service: UnidadMedidaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, )
 
  create(@Body() dto: CreateUnidadMedidaDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, )

  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, )
 
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, )
 
  update(@Param('id') id: string, @Body() dto: UpdateUnidadMedidaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, )
  
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

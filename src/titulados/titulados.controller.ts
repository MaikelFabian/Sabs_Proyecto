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
import { TituladoService } from './titulados.service';
import { CreateTituladoDto } from './dto/create-titulado.dto';
import { UpdateTituladoDto } from './dto/update-titulado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';

@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('titulados')
export class TituladoController {
  constructor(private readonly service: TituladoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('CREAR_TITULADOS')
  create(@Body() dto: CreateTituladoDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_TITULADOS')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('VER_TITULADO')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('EDITAR_TITULADOS')
  update(@Param('id') id: string, @Body() dto: UpdateTituladoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Roles('ELIMINAR_TITULADOS')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

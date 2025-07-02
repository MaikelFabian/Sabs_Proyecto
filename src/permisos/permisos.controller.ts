import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { Permiso } from './entities/permiso.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Get('rol/:idRol')
  async obtenerPermisosPorRol(@Param('idRol') idRol: string, @Request() req) {
    const permisos = await this.permisosService.obtenerPorRol(+idRol);
    return {
      message: `Permisos del rol ${idRol}`,
      data: permisos,
    };
  }

  @Get('por-ruta')
  async obtenerPermisosPorRuta(
    @Query('ruta') ruta: string,
    @Query('idRol') idRol: string,
    @Request() req
  ) {
    const permiso = await this.permisosService.getPermisoPorRutaYRol(ruta, +idRol);
    return {
      message: `Permisos para la ruta ${ruta}`,
      data: permiso,
    };
  }

  @Get()
  findAll(@Request() req): Promise<Permiso[]> {
    return this.permisosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Permiso> {
    return this.permisosService.findOne(+id);
  }

  @Post()
  create(@Body() permisoData: Partial<Permiso>, @Request() req): Promise<Permiso> {
    return this.permisosService.create(permisoData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() permisoData: Partial<Permiso>, @Request() req): Promise<Permiso> {
    return this.permisosService.update(+id, permisoData);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.permisosService.remove(+id);
  }
}

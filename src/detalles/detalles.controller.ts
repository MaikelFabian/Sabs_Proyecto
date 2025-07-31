
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetallesService } from './detalles.service';
import { CreateDetallesDto } from './dto/create-detalle.dto';
import { UpdateDetallesDto } from './dto/update-detalle.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';


@Controller('detalles')
export class DetallesController {
  constructor(private readonly service: DetallesService) {}

  @Post()
  create(@Body() dto: CreateDetallesDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  
  @Get('historial')
  findHistorialCompleto() {
    return this.service.findHistorialCompleto();
  }

  @Get('historial/persona/:personaId')
  findHistorialPorPersona(@Param('personaId') personaId: string) {
    return this.service.findHistorialPorPersona(+personaId);
  }

  @Get(':id')
  @Roles('VER_DETALLE')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles('EDITAR_DETALLES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  update(@Param('id') id: string, @Body() dto: UpdateDetallesDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
 
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch(':id/aprobar')
  async aprobar(
    @Param('id') id: string,
    @Body('personaApruebaId') personaApruebaId: number,
  ) {
    return this.service.aprobar(+id, personaApruebaId);
  }

  @Patch(':id/rechazar')
  async rechazar(
    @Param('id') id: string,
    @Body('personaApruebaId') personaApruebaId: number,
  ) {
    return this.service.rechazar(+id, personaApruebaId);
  }

  @Get('pendientes')
  async findPendientes() {
    return this.service.findPendientes();
  }

  @Get('por-solicitud/:solicitudId')
  async findBySolicitud(@Param('solicitudId') solicitudId: string) {
    return this.service.findBySolicitud(+solicitudId);
  }
}


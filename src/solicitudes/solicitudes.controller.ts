import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';

//@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.service.create(dto);
  }

  @Put(':id/aprobar')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  //@Roles('APROBAR_SOLICITUDES')
  async aprobarSolicitud(@Param('id') id: number, @Req() req) {
    const personaApruebaId = req.user.id;
    return this.service.aprobarSolicitud(+id, personaApruebaId);
  }

  @Put(':id/entregar')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  //@Roles('ENTREGAR_SOLICITUDES')
  async entregarSolicitud(@Param('id') id: number, @Req() req) {
    const personaEncargadaId = req.user.id;
    return this.service.entregarSolicitud(+id, personaEncargadaId);
  }

  @Get()
  //@Roles('VER_SOLICITUDES')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  findAll(
    @Query('aprobada') aprobada?: string,
    @Query('personaSolicitaId') personaSolicitaId?: string,
  ) {
    const filter: any = {};
    if (aprobada !== undefined) {
      filter.aprobada = aprobada === 'true'; // convertir string -> boolean
    }
    if (personaSolicitaId !== undefined) {
      filter.personaSolicitaId = Number(personaSolicitaId);
    }
    return this.service.findAll();
  }

  @Get(':id')
  //@Roles('VER_SOLICITUD')
  //@UseGuards(JwtAuthGuard, PermisosGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  //@Roles('EDITAR_SOLICITUDES')
  // @UseGuards(JwtAuthGuard, PermisosGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSolicitudDto,
  ) {
    const { detalles, ...rest } = dto;
    return this.service.update(id, rest);
  }

  @Delete(':id')
  @Roles('ELIMINAR_SOLICITUDES')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/movimientos')
  getMovimientos(@Param('id', ParseIntPipe) id: number) {
    return this.service.getMovimientosPorSolicitud(id);
  }

  @Post(':id/aprobar')
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body('aprobadorId') aprobadorId: number,
  ) {
    return this.service.aprobarSolicitud(id, aprobadorId);
  }

  @Post(':id/entregar')
  entregar(
    @Param('id', ParseIntPipe) id: number,
    @Body('encargadoId') encargadoId: number,
  ) {
    return this.service.entregarSolicitud(id, encargadoId);
  }

  @Post(':id/devolver')
  devolver(
    @Param('id', ParseIntPipe) id: number,
    @Body('encargadoId') encargadoId: number,
  ) {
    return this.service.devolverSolicitud(id, encargadoId);
  }
}

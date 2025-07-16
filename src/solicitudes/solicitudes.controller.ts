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
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permisos.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.service.create(dto);
  }

  @Put(':id/aprobar')
  @UseGuards(LocalAuthGuard, PermisosGuard)
  @Roles('APROBAR_SOLICITUDES')
  async aprobarSolicitud(@Param('id') id: number, @Req() req) {
    const personaApruebaId = req.user.id;
    return this.service.aprobarSolicitud(+id, personaApruebaId);
  }

  @Put(':id/entregar')
  @UseGuards(LocalAuthGuard, PermisosGuard)
  @Roles('ENTREGAR_SOLICITUDES')
  async entregarSolicitud(@Param('id') id: number, @Req() req) {
    const personaEncargadaId = req.user.id;
    return this.service.entregarSolicitud(+id, personaEncargadaId);
  }

  @Patch(':id/autorizar')
  @Roles('AUTORIZAR_SOLICITUDES')
  async autorizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { personaApruebaId: number; aprobar: boolean },
  ) {
    return this.service.autorizarSolicitud(
      id,
      dto.personaApruebaId,
      dto.aprobar,
    );
  }

  @Get('filtrar')
  @Roles('VER_SOLICITUDES')
  async filtrar(@Query('aprobada') aprobada: boolean) {
    return this.service.filtrarPorEstado(aprobada);
  }

  @Get()
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSolicitudDto,
  ) {
    const { detalles, ...rest } = dto;
    return this.service.update(id, rest);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Endpoint para obtener las solicitudes de un usuario específico
}

// src/movimientos/movimientos.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { MovimientosService } from './movimientos.service';

// src/movimientos/movimientos.controller.ts
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}


 @Post()
async create(@Body() dto: {
  personaSolicitaId: number;
  sitioOrigenId: number;
  sitioDestinoId?: number | null;
  detalles: { materialId: number; cantidad: number }[];
  tipoMovimientoId?: number | null; // <-- NUEVO
}) {
  return this.movimientosService.createMovimiento(dto);
}

@Patch(':id/devolver')
async devolver(
  @Param('id') id: number,
  @Body() dto: {
    personaSolicitaId: number;
    detalles: { materialId: number; cantidad: number }[];
  },
) {
  return this.movimientosService.devolverMaterial({
    movimientoOrigenId: +id,
    personaSolicitaId: dto.personaSolicitaId,
    detalles: dto.detalles,
  });
}

  
@Patch(':id/aprobar')
async aprobar(
  @Param('id') id: number,
  @Body('aprobadoPorId') aprobadoPorId: number,
) {
  return this.movimientosService.aprobarMovimiento(+id, aprobadoPorId);
}



@Patch(':id/rechazar')
async rechazar(
  @Param('id') id: number,
  @Body('rechazadoPorId') rechazadoPorId: number,
) {
  return this.movimientosService.rechazarMovimiento(+id, rechazadoPorId);
}



 
  @Get()
  async findAll() {
    return this.movimientosService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.movimientosService.findOne(+id); // ✅ CORREGIDO
  }

@Get('saldo/:materialId')
async getSaldoPendiente(@Param('materialId') materialId: number) {
  const saldo = await this.movimientosService.getSaldoPendiente(+materialId);
  return { saldoPendiente: saldo };
}

// ✅ NUEVO: Obtener préstamos activos por material
@Get('prestamos-activos/:materialId')
async getPrestamosActivos(@Param('materialId') materialId: number) {
  return this.movimientosService.getPrestamosActivos(+materialId);
}
}

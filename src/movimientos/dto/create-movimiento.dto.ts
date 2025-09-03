export class CreateMovimientoDto {
  personaSolicitaId: number;
  sitioOrigenId: number;
  sitioDestinoId?: number;
  detalles: { materialId: number; cantidad: number }[];
}

export class AprobarMovimientoDto {
  aprobadoPorId: number;
}

export class RechazarMovimientoDto {
  rechazadoPorId: number;
}

export class DevolverMaterialDto {
  movimientoOrigenId: number;
  personaSolicitaId: number;
  detalles: { materialId: number; cantidad: number }[];
}

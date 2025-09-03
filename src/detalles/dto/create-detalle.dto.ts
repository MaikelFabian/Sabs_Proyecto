import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDetallesDto {
  @IsNumber()
  cantidad: number;

  @IsNumber()
  materialId: number;

  @IsOptional()
  @IsNumber()
  solicitudId?: number;

  // ✅ NUEVO: Campos adicionales requeridos
  @IsOptional()
  @IsString()
  numeroFactura?: string;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsNumber()
  solicitanteId?: number;

  @IsOptional()
  @IsString()
  estado?:
    | 'PENDIENTE'
    | 'APROBADO'
    | 'RECHAZADO'
    | 'PRESTADO'
    | 'DEVUELTO'
    | 'CONSUMIDO';

  @IsOptional()
  @IsNumber()
  personaApruebaId?: number;
}

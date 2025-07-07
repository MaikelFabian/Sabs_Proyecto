// src/movimiento/dto/create-movimiento.dto.ts
import { IsOptional, IsNumber, IsBoolean, IsString } from 'class-validator';

export class CreateMovimientoDto {
  @IsOptional()
  @IsNumber()
  tipoMovimientoId?: number;

  @IsOptional()
  @IsNumber()
  personaId?: number;

  @IsBoolean()
  activo: boolean;

  @IsString()
  fechaCreacion: string;

  @IsOptional()
  @IsString()
  fechaActualizacion?: string;
}

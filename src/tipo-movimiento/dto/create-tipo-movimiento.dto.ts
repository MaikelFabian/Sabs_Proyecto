// src/tipo-movimiento/dto/create-tipo-movimiento.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTipoMovimientoDto {
  @IsString()
  nombre: string;

  @IsBoolean()
  activo: boolean;

  @IsString()
  fechaCreacion: string;

  @IsOptional()
  @IsString()
  fechaActualizacion?: string;
}

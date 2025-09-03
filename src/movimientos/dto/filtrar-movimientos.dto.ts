import { IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltrarMovimientosDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  materialId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tipoMovimientoId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  personaId?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}

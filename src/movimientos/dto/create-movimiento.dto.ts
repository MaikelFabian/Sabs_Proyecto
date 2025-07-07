import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateMovimientoDto {
  @IsOptional()
  @IsNumber()
  tipoMovimientoId?: number;

  @IsOptional()
  @IsNumber()
  personaId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovimientoDto {
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  materialId: number;

  @IsNumber()
  tipoMovimientoId: number;

  @IsNumber()
  personaId: number;
  
  @IsOptional()
  @IsNumber()
  solicitudId?: number;
}

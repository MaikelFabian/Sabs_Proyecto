import { IsNumber, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateMovimientoDto {
  @IsNumber()  // Asegura que sea número
  cantidad: number;

  @IsInt()
  materialId: number;

  @IsInt()
  tipoMovimientoId: number;

  @IsInt()
  personaId: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  solicitudId?: number;

  @IsOptional()
  @IsInt()
  sitioId?: number;

  // Otros campos si existen
}

import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateMovimientoDto {
  @IsNotEmpty()
  @IsNumber()
  materialId: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  tipoMovimientoId: number;

  @IsNotEmpty()
  @IsNumber()
  sitioDestinoId: number;

  @IsNotEmpty()
  @IsNumber()
  solicitanteId: number;

  @IsOptional()
  @IsNumber()
  aprobadorId?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  sitioOrigenId?: number;
}

import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

export class AprobarMovimientoDto {
  @IsNotEmpty()
  @IsEnum(['APROBADO', 'RECHAZADO'])
  estado: 'APROBADO' | 'RECHAZADO';

  @IsNotEmpty()
  @IsNumber()
  aprobadorId: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsBoolean()
  desactivarMaterial?: boolean;
}
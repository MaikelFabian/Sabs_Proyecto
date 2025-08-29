import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';

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
}
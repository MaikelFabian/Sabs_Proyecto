import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateSitioDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  tipoSitioId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

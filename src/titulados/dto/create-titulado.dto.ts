import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateTituladoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsNumber()
  fichaId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

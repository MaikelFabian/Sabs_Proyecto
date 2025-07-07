import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCentroDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  municipioId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

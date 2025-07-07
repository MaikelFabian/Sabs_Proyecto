
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateFichaDto {
  @IsNumber()
  numero: number;

  @IsOptional()
  @IsNumber()
  cantidadAprendices?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}


import { IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFichaDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  numero: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  cantidadAprendices?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  activo?: boolean;
}

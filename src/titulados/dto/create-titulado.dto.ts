import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTituladoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  areaId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  fichaId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  activo?: boolean;
}

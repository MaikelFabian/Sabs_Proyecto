import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSitioDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    // Convertir string vacía a undefined para campos opcionales
    if (value === '' || value === null) return undefined;
    return Number(value);
  })
  tipoSitioId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    // Manejar valores booleanos desde formularios
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  activo?: boolean;
}

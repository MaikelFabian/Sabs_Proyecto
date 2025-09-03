import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoMovimientoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

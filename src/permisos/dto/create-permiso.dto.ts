import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePermisoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  opcionId?: number;
}

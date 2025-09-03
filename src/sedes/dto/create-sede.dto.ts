
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateSedeDto {
  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsOptional()
  @IsNumber()
  centroId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

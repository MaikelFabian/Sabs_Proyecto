
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateRolDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  permisosId?: number;
}

import { IsOptional, IsNumber } from 'class-validator';

export class CreateRolPermisoOpcionDto {
  @IsOptional()
  @IsNumber()
  rolId?: number;

  @IsOptional()
  @IsNumber()
  permisoId?: number;

  @IsOptional()
  @IsNumber()
  opcionId?: number;
}

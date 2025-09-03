import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoSitioDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

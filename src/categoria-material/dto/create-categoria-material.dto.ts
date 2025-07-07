import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoriaMaterialDto {
  @IsString()
  codigo: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

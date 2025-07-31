import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoriaMaterialDto {
  @IsString()
  codigo: string;


  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

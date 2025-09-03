import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoriaMaterialDto {
  @IsString()
  categoria: string;  // ✅ CORREGIDO: cambié de 'codigo' a 'categoria'

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

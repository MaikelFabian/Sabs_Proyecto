// src/tipo-material/dto/create-tipo-material.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoMaterialDto {
  @IsString()
  tipo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

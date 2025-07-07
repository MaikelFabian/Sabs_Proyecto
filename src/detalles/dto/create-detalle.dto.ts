// src/detalles/dto/create-detalles.dto.ts
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateDetallesDto {
  @IsNumber()
  cantidadSolicitada: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  materialId?: number;

  @IsOptional()
  @IsNumber()
  personaEncargadaId?: number;

  @IsOptional()
  @IsNumber()
  personaSolicitaId?: number;

  @IsOptional()
  @IsNumber()
  personaApruebaId?: number;
}

// src/material/dto/create-material.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  stock: number;

  @IsBoolean()
  caduca: boolean;

  @IsOptional()
  @IsString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsNumber()
  tipoMaterialId?: number;

  @IsOptional()
  @IsNumber()
  unidadMedidaId?: number;

  @IsOptional()
  @IsNumber()
  categoriaMaterialId?: number;

  // ✅ NUEVO CAMPO: Sitio
  @IsOptional()
  @IsNumber()
  sitioId?: number;

  // ✅ NUEVO CAMPO: Persona que registra el material
  @IsOptional()
  @IsNumber()
  registradoPorId?: number;

  @IsOptional()
  @IsBoolean()
  requiereDevolucion?: boolean;
}


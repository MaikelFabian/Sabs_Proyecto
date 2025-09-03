// src/material/dto/create-material.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMaterialDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  // ❌ ELIMINADO: stock: number; - Ahora se maneja solo por Stock entities

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return Boolean(value);
  })
  caduca: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  fechaVencimiento?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  tipoMaterialId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  unidadMedidaId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  categoriaMaterialId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  sitioId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  registradoPorId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    if (value === '' || value === null || value === undefined) return undefined;
    return Boolean(value);
  })
  requiereDevolucion?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    if (value === '' || value === null || value === undefined) return undefined;
    return Boolean(value);
  })
  esOriginal?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  materialOrigenId?: number;

  // ✅ NUEVA PROPIEDAD: Para materiales prestados
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  cantidadPrestada?: number;
}
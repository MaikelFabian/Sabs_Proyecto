import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  materialId: number;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsBoolean()
  requiereCodigo?: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
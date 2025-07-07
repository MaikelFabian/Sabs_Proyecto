import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOpcionDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  rutaFrontend: string;

  @IsNumber()
  moduloId: number;
}

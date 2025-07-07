import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateAreaCentroDto {
  @IsOptional()
  @IsNumber()
  centroId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

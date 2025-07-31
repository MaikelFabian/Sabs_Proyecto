import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsString()
  unidad: string;

  @IsString()
  simbolo: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

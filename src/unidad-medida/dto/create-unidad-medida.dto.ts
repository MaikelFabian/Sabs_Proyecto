import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsString()
  unidad: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

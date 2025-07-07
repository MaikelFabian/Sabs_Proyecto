import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMunicipioDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}


import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail } from 'class-validator';

export class CreatePersonaDto {
  @IsString()
  identificacion: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsEmail()
  correo: string;

  @IsString()
  contrasena: string;

  @IsNumber()
  edad: number;

  @IsOptional()
  @IsNumber()
  fichaId?: number;

  @IsOptional()
  @IsNumber()
  rolId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

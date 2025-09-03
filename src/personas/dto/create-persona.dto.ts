
import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail, IsNotEmpty, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePersonaDto {
  @IsString()
  @IsNotEmpty()
  identificacion: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;

  @IsNumber({}, { message: 'La edad debe ser un número' })
  @Min(1, { message: 'La edad debe ser mayor a 0' })
  @Max(120, { message: 'La edad debe ser menor a 120' })
  @Transform(({ value }) => parseInt(value))
  edad: number;

  @IsOptional()
  @IsNumber({}, { message: 'fichaId debe ser un número' })
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  fichaId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'rolId debe ser un número' })
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  rolId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

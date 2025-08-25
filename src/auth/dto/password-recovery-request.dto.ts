import { IsEmail, IsString } from 'class-validator';

export class PasswordRecoveryRequestDto {
  @IsEmail()
  correo: string;

  @IsString()
  identificacion: string; // Cambiado a 'identificacion' para coincidir con la entidad
}
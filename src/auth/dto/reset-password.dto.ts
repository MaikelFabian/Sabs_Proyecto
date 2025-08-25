import { IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  nuevaContrasena: string;

  @IsString()
  confirmarContrasena: string;
}
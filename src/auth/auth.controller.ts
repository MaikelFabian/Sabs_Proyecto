import { Controller, Post, Body, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('correo') correo: string,
    @Body('contrasena') contrasena: string,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(correo, contrasena);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return this.authService.login(user, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.send({ message: 'Sesión cerrada correctamente' });
  }
}
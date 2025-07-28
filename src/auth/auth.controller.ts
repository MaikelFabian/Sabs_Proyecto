
import { Controller, Post, Request, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log('👤 Usuario autenticado:', req.user);
    const result = await this.authService.login(req.user);
    console.log('🔐 Token generado:', result.access_token ? 'Token creado correctamente' : 'Error al crear token');
    console.log('📦 Datos de usuario a devolver:', result.user);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 1000 * 60 * 60 * 24, 
    });
    
    return {
      user: result.user,
      message: 'Login exitoso',
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Eliminar la cookie de acceso
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    return {
      message: 'Logout exitoso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return {
      user: req.user,
      message: 'Perfil obtenido exitosamente',
    };
  }
}

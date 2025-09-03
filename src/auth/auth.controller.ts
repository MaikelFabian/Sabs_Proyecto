
import { Controller, Post, Request, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Body, Param } from '@nestjs/common';
import { PasswordRecoveryRequestDto } from './dto/password-recovery-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    //console.log('👤 Usuario autenticado:', req.user);
    const result = await this.authService.login(req.user);
    //console.log('🔐 Token generado:', result.access_token ? 'Token creado correctamente' : 'Error al crear token');
    //console.log('📦 Datos de usuario a devolver:', result.user);
    
    // ✅ CONFIGURACIÓN CORREGIDA - SIN DOMAIN
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });
    
    //console.log('🍪 COOKIE ESTABLECIDA:', result.access_token.substring(0, 20) + '...'); // Log temporal
    
    return {
      user: result.user,
      message: 'Login exitoso',
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
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

  @Post('password-recovery/request')
  async requestReset(@Body() dto: PasswordRecoveryRequestDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Get('password-recovery/verify/:token')
  async verifyToken(@Param('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Post('password-recovery/reset')
  async reset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.nuevaContrasena, dto.confirmarContrasena);
  }
}

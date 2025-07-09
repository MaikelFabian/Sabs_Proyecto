import { Controller, Post, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(req.user);

   
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, 
    });

   
    return {
      user: result.user,
      message: 'Login exitoso',
    };
  }
}

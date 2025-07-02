import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PersonasService } from '../personas/personas.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly personasService: PersonasService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string): Promise<any> {
    const user = await this.personasService.findByEmail(correo);
    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    const { contrasena: _, ...resto } = user;
    return resto;
  }

  login(user: any, res: Response) {
    const payload = { correo: user.correo, sub: user.id, role: user.rol };
    const token = this.jwtService.sign(payload);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400000, 
    });
    return res.send({
      message: 'Login exitoso',
      user: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        role: user.rol,
      },
    });
  }
}
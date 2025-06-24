import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonasService } from '../personas/personas.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly personasService: PersonasService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string): Promise<any> {
    const user = await this.personasService.findByEmail(correo);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const { contrasena: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }
}
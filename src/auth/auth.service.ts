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
  const permisos = user.rol?.rolesPermisosOpciones?.map(
    (rpo) => rpo.permiso?.codigo
  ) || [];

  const opciones = user.rol?.rolesPermisosOpciones
    ?.map((rpo) => ({
      id: rpo.opcion?.id,
      nombre: rpo.opcion?.nombre,
      rutaFrontend: rpo.opcion?.rutaFrontend,
    }))
    .filter((opcion) => opcion && opcion.id) // filtrar nulls
    .reduce((acc, curr) => {
      if (!acc.find((o) => o.id === curr.id)) acc.push(curr);
      return acc;
    }, []);

  const modulos = user.rol?.rolesPermisosOpciones
    ?.map((rpo) => ({
      id: rpo.opcion?.modulo?.id,
      nombre: rpo.opcion?.modulo?.nombre,
    }))
    .filter((modulo) => modulo && modulo.id)
    .reduce((acc, curr) => {
      if (!acc.find((m) => m.id === curr.id)) acc.push(curr);
      return acc;
    }, []);

  const payload = {
    sub: user.id,
    correo: user.correo,
    rol: user.rol?.nombre,
    rolId: user.rol?.id,
    permisos, 
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol?.nombre,
      rolId: user.rol?.id,
      permisos,
      opciones,
      modulos,
    },
  };
}
}
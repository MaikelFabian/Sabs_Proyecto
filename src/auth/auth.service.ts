import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonasService } from '../personas/personas.service';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PasswordRecoveryRequestDto } from './dto/password-recovery-request.dto'; // Ajusta la ruta si es necesario

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

    return {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rolId: user.rol?.id,
      rol: user.rol,
    };
  }

  async login(user: any) {
    const permisos =
      user.rol?.rolesPermisosOpciones?.map((rpo) => rpo.permiso?.codigo) || [];
  
    const opciones = user.rol?.rolesPermisosOpciones
      ?.map((rpo) => ({
        id: rpo.opcion?.id,
        nombre: rpo.opcion?.nombre,
        rutaFrontend: rpo.opcion?.rutaFrontend,
      }))
      .filter((opcion) => opcion && opcion.id)
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
      nombre: user.nombre,
      rol: user.rol?.nombre,
      rolId: user.rol?.id,
    
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

  async requestPasswordReset(dto: PasswordRecoveryRequestDto): Promise<{ message: string; token?: string }> {
    const { correo, identificacion } = dto;
  
    const user = await this.personasService.findByEmail(correo);
  
    if (!user || user.identificacion !== identificacion) {
      throw new NotFoundException('Usuario no encontrado o identificación incorrecta');
    }
  
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
  
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
  
    await this.personasService.update(user.id, user);
  

    return { message: 'Enlace de recuperación enviado al correo', token: resetToken };
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.type !== 'password_reset') {
        return { valid: false };
      }
      const userResponse = await this.personasService.findOneComplete(decoded.sub);
      const user = userResponse.data;
      return { valid: true, email: user?.correo };
    } catch (error) {
      return { valid: false };
    }
  }

  async resetPassword(token: string, nuevaContrasena: string, confirmarContrasena: string): Promise<{ message: string }> {
    if (nuevaContrasena !== confirmarContrasena) {
      throw new UnauthorizedException('Las contraseñas no coinciden');
    }

    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.type !== 'password_reset') {
        throw new UnauthorizedException('Token inválido');
      }

      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
      await this.personasService.updatePassword(decoded.sub, hashedPassword);

      return { message: 'Contraseña restablecida exitosamente' };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

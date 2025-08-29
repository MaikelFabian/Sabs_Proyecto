import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('🔑 JwtAuthGuard - user:', user);
    console.log('🔑 JwtAuthGuard - err:', err);
    console.log('🔑 JwtAuthGuard - info:', info);
    
    if (err || !user) {
      console.log(
        '❌ Error de JWT:',
        err?.message || info?.message || 'Token inválido o expirado',
      );
      // 🚨 CRÍTICO: Lanzar excepción en lugar de devolver false
      throw new UnauthorizedException(
        err?.message || info?.message || 'Token inválido o expirado'
      );
    }
    
    console.log('✅ Usuario autenticado correctamente:', user.email || user.id);
    return user;
  }
}

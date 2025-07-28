import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('🔑 JwtAuthGuard - user:', user);
    if (err || !user) {
      console.log(
        '❌ Error de JWT:',
        err?.message || 'Token inválido o expirado',
      );
    }
    return user;
  }
}

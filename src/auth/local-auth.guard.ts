import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, user, info) {
        //console.log('🔑 LocalAuthGuard - user:', user);
        if (err || !user) {
            console.log('❌ Error de autenticación detallado:', {
                error: err?.message || 'Usuario no encontrado',
                info: info,
                user: user
            });
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return user;
    }
}
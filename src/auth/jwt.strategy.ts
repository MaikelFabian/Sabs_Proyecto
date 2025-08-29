import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET || 'Sabs',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log('🍪 Todas las cookies:', request.cookies);
          console.log('🍪 Headers:', request.headers.cookie);
          const token = request.cookies?.access_token;
          console.log('🍪 Cookie JWT en extractor:', token);
          return token;
        },
      ]),
    });
    console.log('✅ JwtStrategy construida');
  }

  async validate(payload: any) {
    console.log('✅ JwtStrategy validate payload:', payload);
    return payload;
  }
}

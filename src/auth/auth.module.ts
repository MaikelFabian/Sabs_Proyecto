import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PersonasModule } from '../personas/personas.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PersonasModule,
    PassportModule,
    JwtModule.register({
      secret: 'Sabs',
      signOptions: { expiresIn: '24h' },
     
    }),
    
  ],
  providers: [AuthService, LocalStrategy,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../models/entity/jwt-secret';
import { PassportModule } from '@nestjs/passport';
import { PassportAuthController } from 'src/auth/passport-auth.controller';
import { LocalStrategy } from 'src/auth/strategies/local.strategie';
import { JwtStrategy } from './strategies/jwt.strategie';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, PassportAuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}

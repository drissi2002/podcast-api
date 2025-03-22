/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'my-local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'user',
      passwordField: 'pass',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser({
      username,
      password,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}

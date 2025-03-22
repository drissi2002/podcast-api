import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthInput } from '../models/entity/auth-input.entity';
import { SignInData } from '../models/entity/sign-in-data.entity';
import { UsersService } from 'src/users/users.service';
import { AuthResult } from '../models/entity/auth-result.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = this.usersService.findUserByName(input.username);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.userId, username: user.username };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      userId: user.userId,
      username: user.username,
    };
  }

  validateUser(input: AuthInput): SignInData | null {
    const user = this.usersService.findUserByName(input.username);
    if (user && user.password === input.password) {
      return {
        userId: user.userId,
        username: user.username,
      };
    }
    return null;
  }

  signIn(user: SignInData): AuthResult {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    return {
      userId: user.userId,
      username: user.username,
      accessToken: accessToken,
    };
  }

  async findUserById(userId: number) {
    return this.usersService.findOneById(userId);
  }
}

import {
  Body,
  Controller,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInput } from '../models/entity/auth-input.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { plainToClass } from 'class-transformer';
import { User } from 'src/models/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: AuthInput) {
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = request.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const user = await this.authService.findUserById(userId);
    return plainToClass(User, user); // return the user object without the password
    // return user;  return the user object with the encrypted password
  }
}

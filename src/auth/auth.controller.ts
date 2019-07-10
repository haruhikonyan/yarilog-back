import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(): Promise<any> {
    return await this.authService.login();
  }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // this route is restricted by AuthGuard
    // JWT strategy
    return 'hoge'
  }
}

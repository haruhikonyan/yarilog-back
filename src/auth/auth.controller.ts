import { Controller, Get, UseGuards, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

export interface LoginObject {
  // mailAddress or username
  loginId: string;
  password: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginObject: LoginObject): Promise<any> {
    const token: string = await this.authService.login(loginObject)
    if (token == null) {
      throw new HttpException('feild login', HttpStatus.UNAUTHORIZED);
    }
    return token;
  }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // this route is restricted by AuthGuard
    // JWT strategy
    return 'hoge'
  }
}

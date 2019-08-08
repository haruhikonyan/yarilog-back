import { Controller, Get, UseGuards, Post, Body, HttpStatus, HttpException, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, LoginResultObject } from './auth.service';

export interface LoginObject {
  // mailAddress or username
  loginId: string;
  password: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginObject: LoginObject): Promise<LoginResultObject> {
    const loginResultObject = await this.authService.login(loginObject)
    if (loginResultObject.token == null || loginResultObject.user == null) {
      throw new HttpException('feild login', HttpStatus.UNAUTHORIZED);
    }
    return loginResultObject;
  }

  @Get('me')
  @UseGuards(AuthGuard())
  findAll(@Request() req) {
    return req.user
  }
}

import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, LoginResultObject, LoginObject } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginObject: LoginObject): Promise<LoginResultObject> {
    const loginResultObject = await this.authService.login(loginObject);
    if (loginResultObject == null) {
      throw new HttpException('feild login', HttpStatus.UNAUTHORIZED);
    }
    return loginResultObject;
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  twitterLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  googleLoginCallback(@Req() req: any) {
    console.log(req);
    const jwt: string = req.user.jwt;
    if (jwt) {
      return `<html><body><script>window.opener.postMessage('${jwt}', 'http://localhost:4200')</script></body></html>`;
    } else {
      return 'There was a problem signing in...';
    }
  }
  @Get('me')
  @UseGuards(AuthGuard())
  findAll(@Request() req: any) {
    return req.user;
  }
}

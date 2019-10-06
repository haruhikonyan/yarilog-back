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
  googleLoginCallback(@Req() req: any, @Res() res: any) {
    const { token, userId } = req.user;
    const redirectPath =
      token && userId
        ? `${process.env.FRONT_URL}/oauth/login?token=${token}&userId=${userId}`
        : `${process.env.FRONT_URL}/login`;

    res.redirect(redirectPath);
  }
  @Get('me')
  @UseGuards(AuthGuard())
  findAll(@Request() req: any) {
    return req.user;
  }
}

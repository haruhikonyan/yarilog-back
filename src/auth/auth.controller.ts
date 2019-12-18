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
import { User } from '../users/users.entity';

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

  @Get('auth-object')
  @UseGuards(AuthGuard('jwt'))
  async authObjextByJwt(@Request() req: any): Promise<LoginResultObject> {
    const me: User = req.user;
    return this.authService.createLoginResultObject(me);
  }

  @Get('twitter')
  @UseGuards(AuthGuard('twitter'))
  twitterLogin() {
    // initiates the Twitter OAuth2 login flow
  }

  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  twitterLoginCallback(@Req() req: any, @Res() res: any) {
    const {
      token,
      userId,
      consentTos,
      newUserProvider,
    } = req.user as LoginResultObject;
    const redirectPath =
      token && userId
        ? `${
            process.env.FRONT_URL
          }/login/oauth?token=${token}&userId=${userId}&consentTos=${consentTos}&newUserProvider=${newUserProvider}`
        : `${process.env.FRONT_URL}/login`;

    res.redirect(redirectPath);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    // initiates the Facebook OAuth2 login flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req: any, @Res() res: any) {
    const {
      token,
      userId,
      consentTos,
      newUserProvider,
    } = req.user as LoginResultObject;
    const redirectPath =
      token && userId
        ? `${
            process.env.FRONT_URL
          }/login/oauth?token=${token}&userId=${userId}&consentTos=${consentTos}&newUserProvider=${newUserProvider}`
        : `${process.env.FRONT_URL}/login`;

    res.redirect(redirectPath);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Facebook OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: any, @Res() res: any) {
    const {
      token,
      userId,
      consentTos,
      newUserProvider,
    } = req.user as LoginResultObject;
    const redirectPath =
      token && userId
        ? `${
            process.env.FRONT_URL
          }/login/oauth?token=${token}&userId=${userId}&consentTos=${consentTos}&newUserProvider=${newUserProvider}`
        : `${process.env.FRONT_URL}/login`;

    res.redirect(redirectPath);
  }

  @Get('line')
  @UseGuards(AuthGuard('line'))
  lineLogin() {
    // initiates the Facebook OAuth2 login flow
  }

  @Get('line/callback')
  @UseGuards(AuthGuard('line'))
  lineLoginCallback(@Req() req: any, @Res() res: any) {
    const {
      token,
      userId,
      consentTos,
      newUserProvider,
    } = req.user as LoginResultObject;
    const redirectPath =
      token && userId
        ? `${
            process.env.FRONT_URL
          }/login/oauth?token=${token}&userId=${userId}&consentTos=${consentTos}&newUserProvider=${newUserProvider}`
        : `${process.env.FRONT_URL}/login`;

    res.redirect(redirectPath);
  }
  @Get('me')
  @UseGuards(AuthGuard())
  findAll(@Request() req: any) {
    return req.user;
  }
}

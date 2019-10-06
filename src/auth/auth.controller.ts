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
    const jwtToken: string = req.user.jwtToken;
    if (jwtToken) {
      res.redirect(`${process.env.FRONT_URL}/oauth/login?token=${jwtToken}`);
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

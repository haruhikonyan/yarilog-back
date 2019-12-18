// TODO @types/passport-facebook いれる
// @ts-ignore: Could not find a declaration file for module
import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, LoginResultObject } from './auth.service';
import { ProviderType } from './extarnal-accounts/extarnal-accounts.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BACK_URL}/auth/facebook/callback`, // 認証成功時の戻り先URL
    });
  }

  async validate(
    _accessToken: any,
    _refreshToken: any,
    profile: any,
  ): Promise<LoginResultObject> {
    const { user, isNewUser } = await this.authService.findOrCreateOauthUser({
      id: profile.id,
      providerType: ProviderType.FACEBOOK,
      nickname: profile.displayName,
      mailAddress: null,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const newUserProvider = isNewUser ? 'Facebook' : null;
    return this.authService.createLoginResultObject(user, newUserProvider);
  }
}

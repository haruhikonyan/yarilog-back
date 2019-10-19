// TODO @types/passport-google いれる
// @ts-ignore: Could not find a declaration file for module
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, LoginResultObject } from './auth.service';
import { ProviderType } from './extarnal-accounts/extarnal-accounts.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CONSUMER_KEY,
      clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
      callbackURL: `${process.env.BACK_URL}/auth/google/callback`, // 認証成功時の戻り先URL
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: any,
    _refreshToken: any,
    profile: any,
  ): Promise<LoginResultObject> {
    const user = await this.authService.findOrCreateOauthUser({
      id: profile.id,
      providerType: ProviderType.GOOGLE,
      nickname: profile.displayName,
      mailAddress: profile.emails[0].value,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.createLoginResultObject(user);
  }
}

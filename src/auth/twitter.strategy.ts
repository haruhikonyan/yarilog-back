// TODO @types/passport-twitter いれる
// @ts-ignore: Could not find a declaration file for module
import { Strategy } from 'passport-twitter';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProviderType } from './extarnal-accounts/extarnal-accounts.entity';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      consumerKey: process.env.TWITTER_API_KEY, // TwitterのconsumerKey
      consumerSecret: process.env.TWITTER_API_SECRET, // TwitterのconsumerSecret
      callbackURL: `${process.env.BACK_URL}/auth/twitter/callback`, // 認証成功時の戻り先URL
    });
  }

  async validate(_token: any, _tokenSecret: any, profile: any): Promise<any> {
    const user = await this.authService.findOrCreateOauthUser({
      id: profile.id,
      providerType: ProviderType.TWITTER,
      nickname: profile.displayName,
      mailAddress: null,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { jwtToken: this.authService.createJwtToken(user.id) };
  }
}

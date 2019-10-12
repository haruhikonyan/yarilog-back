// TODO @types/passport-line-auth いれる
// @ts-ignore: Could not find a declaration file for module
import { Strategy } from 'passport-line-auth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, LoginResultObject } from './auth.service';
import { ProviderType } from './extarnal-accounts/extarnal-accounts.entity';

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      channelID: process.env.LINE_CHANNEL_ID,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
      callbackURL: `${process.env.BACK_URL}/auth/line/callback`, // 認証成功時の戻り先URL
      scope: ['profile', 'openid', 'email'],
    });
  }

  async validate(
    _accessToken: any,
    _refreshToken: any,
    params: any,
  ): Promise<LoginResultObject> {
    const user = await this.authService.findOrCreateOauthUser({
      id: params.id,
      providerType: ProviderType.LINE,
      nickname: params.displayName,
      mailAddress: null,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { token: this.authService.createJwtToken(user.id), userId: user.id };
  }
}

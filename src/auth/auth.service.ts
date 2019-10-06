import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';
import { ExtarnalAccountsService } from './extarnal-accounts/extarnal-accounts.service';
import { ProviderType } from './extarnal-accounts/extarnal-accounts.entity';

export interface LoginResultObject {
  token: string;
  userId: string;
}

export interface LoginObject {
  // mailAddress or username
  loginId: string;
  password: string;
}

export interface AuthLoginObject {
  id: string;
  providerType: ProviderType;
  nickname: string;
  mailAddress: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly extarnalAccountsService: ExtarnalAccountsService,
  ) {}

  async login(loginObject: LoginObject): Promise<LoginResultObject | null> {
    const user:
      | User
      | undefined = await this.usersService.findByUsernameOrMailAddressWithPassword(
      loginObject,
    );

    // 該当のユーザがいない場合は null を返して 401 にする
    if (user == null) {
      return null;
    }
    // user がいてもパスワードが一致しなければ null を返して 401 にする
    if (
      user == null ||
      user.password == null ||
      !(await bcrypt.compare(loginObject.password, user.password))
    ) {
      return null;
    }
    return { token: this.createJwtToken(user.id), userId: user.id };
  }

  createJwtToken(userId: string) {
    const payload: JwtPayload = { userId };
    return this.jwtService.sign(payload);
  }

  async findOrCreateOauthUser(authLoginObject: AuthLoginObject) {
    const externalAccount = await this.extarnalAccountsService.findByAuthLoginObject(
      authLoginObject,
    );

    // すでにアカウントがあれば user をそのまま返す
    if (externalAccount) {
      return externalAccount.user;
    }
    // 該当のユーザがいない場合は新規作成
    const extarnalAccount = await this.extarnalAccountsService.createFromOauthLogin(
      authLoginObject,
    );
    return extarnalAccount.user;
    // // user がいてもパスワードが一致しなければ null を返して 401 にする
    // if (!(await bcrypt.compare(loginObject.password, user.password))) {
    //   return null;
    // }
    // const payload: JwtPayload = { userId: user.id };
    // return { token: this.jwtService.sign(payload), userId: user.id };
  }

  async validateUser(payload: JwtPayload): Promise<User | undefined> {
    // ここに来るときは必ず自分自身なので isMine は true
    return await this.usersService.findById(payload.userId, true);
  }

  async getMeByAuthorizationHeaderToken(
    authorizationHeaderToken: string,
  ): Promise<User | undefined> {
    // authorizationHeaderToken が存在してない場合は未ログインなので null を返す
    if (authorizationHeaderToken == null) {
      return undefined;
    }
    const token = authorizationHeaderToken.replace(/Bearer\s/, '');
    const payload: JwtPayload = this.jwtService.decode(token) as JwtPayload;
    // token が存在して payload が取得できなければ不正なアクセスとして 401 を返す
    if (!payload) {
      throw new UnauthorizedException();
    }
    return await this.validateUser(payload);
  }
}

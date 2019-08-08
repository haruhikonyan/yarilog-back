import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/users.entity';
import { LoginObject } from './auth.controller';

export interface LoginResultObject {
  token: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginObject: LoginObject): Promise<LoginResultObject> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials

    const loggedInUser: User = await this.usersService.findByUsernameOrMailAddressAndPasswordForLogin(loginObject);
    // 該当のユーザがいなかった場合とりあえず null を返す
    if (loggedInUser == null) {
      return null;
    }
    const payload: JwtPayload = { userId: loggedInUser.id };
    return {token: this.jwtService.sign(payload), user: loggedInUser};
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.findById(payload.userId);
  }

  async getMeByAuthorizationHeaderToken(authorizationHeaderToken: string): Promise<User> | null {
    // authorizationHeaderToken が存在してない場合は未ログインなので null を返す
    if (authorizationHeaderToken == null) { return null; }
    const token = authorizationHeaderToken.replace(/Bearer\s/, '')
    const payload: JwtPayload = this.jwtService.decode(token) as JwtPayload;
    // token が存在して payload が取得できなければ不正なアクセスとして 401 を返す
    if (!payload) {
      throw new UnauthorizedException();
    }
    return await this.validateUser(payload);
  }
}
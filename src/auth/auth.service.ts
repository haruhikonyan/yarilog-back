import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/users.entity';
import { LoginObject } from './auth.controller';
import * as bcrypt from 'bcrypt';

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
    const user: User = await this.usersService.findByUsernameOrMailAddressWithPassword(loginObject);

    // 該当のユーザがいない場合は null を返して 401 にする
    if (user == null) {
      return null;
    }
    // user がいてもパスワードが一致しなければ null を返して 401 にする
    if (!(await bcrypt.compare(loginObject.password, user.password))) {
      return null;
    }
 　　 
    const payload: JwtPayload = { userId: user.id };
    return {token: this.jwtService.sign(payload), user: user};
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    // ここに来るときは必ず自分自身なので isMine は true
    return await this.usersService.findById(payload.userId, true);
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
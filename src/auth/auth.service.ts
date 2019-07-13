import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/users.entity';
import { LoginObject } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginObject: LoginObject): Promise<string> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials

    const loggedInUser: User = await this.usersService.findByUsernameOrMailAddressAndPasswordForLogin(loginObject);
    // 該当のユーザがいなかった場合とりあえず null を返す
    if (loggedInUser == null) {
      console.log(loggedInUser + 'hoege')
      return null;
    }
    console.log(loggedInUser + 'gagaga')
    const payload: JwtPayload = { userId: loggedInUser.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findById(payload.userId);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { LoginObject } from '../auth/auth.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByUsernameOrMailAddressAndPasswordForLogin(loginObject: LoginObject): Promise<User> {
    // TODO パスワード暗号化対応
    return await this.usersRepository.findOne({
      where: [
        // password && (username || mailAddreee) 的な感じで書きたい
        { password: loginObject.password, username: loginObject.loginId },
        { password: loginObject.password, mailAddress: loginObject.loginId }
      ]
    });
  }

  async save(user: User): Promise<User> {
    // TODO user.password は暗号化して保存する
    console.log(user)
    return await this.usersRepository.save(user);
  }
}
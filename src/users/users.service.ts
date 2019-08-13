import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async findAll(getAllField: boolean = false): Promise<User[]> {
    if (getAllField) {
      return await this.usersRepository.createQueryBuilder('user')
        .addSelect(['user.username', 'user.mailAddress'])
        .getMany();
    }
    else {
      return await this.usersRepository.find();
    }
  }

  async findById(id: string, isMine: boolean = false): Promise<User | null> {
    console.log(isMine)
    if (isMine) {
      return await this.usersRepository.createQueryBuilder('user')
        .addSelect(['user.username', 'user.mailAddress'])
        .where({id: id})
        .getOne();
    }
    else {
      return await this.usersRepository.findOne(id);
    }
  }

  /**
   * ログインの為に username もしくは mailAddress でユーザを取得する
   * password もくっつける
   * @param loginObject 
   */
  async findByUsernameOrMailAddressWithPassword(loginObject: LoginObject): Promise<User | null> {
    return await this.usersRepository.createQueryBuilder('user')
      .where(
        [
          { username: loginObject.loginId },
          { mailAddress: loginObject.loginId }
        ]
      ).addSelect('user.password')
      .getOne();
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }
}
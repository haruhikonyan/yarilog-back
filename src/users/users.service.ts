import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { LoginObject } from '../auth/auth.service';
import { SaveUserDto } from './save-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(getAllField: boolean = false): Promise<User[]> {
    if (getAllField) {
      return await this.usersRepository
        .createQueryBuilder('user')
        .addSelect(['user.username', 'user.mailAddress'])
        .orderBy('user.createdAt', 'DESC')
        .getMany();
    } else {
      return await this.usersRepository.find();
    }
  }

  async findById(
    id: string,
    isMine: boolean = false,
  ): Promise<User | undefined> {
    if (isMine) {
      return await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.externalAccount', 'externalAccount')
        .addSelect(['user.username', 'user.mailAddress'])
        .where({ id })
        .getOne();
    } else {
      return await this.usersRepository.findOne(id);
    }
  }

  /**
   * ログインの為に username もしくは mailAddress でユーザを取得する
   * password もくっつける
   * @param loginObject
   */
  async findByUsernameOrMailAddressWithPassword(
    loginObject: LoginObject,
  ): Promise<User | undefined> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where([
        { username: loginObject.loginId },
        { mailAddress: loginObject.loginId },
      ])
      .addSelect('user.password')
      .getOne();
  }

  async save(userData: User | SaveUserDto): Promise<User> {
    return await this.usersRepository.save(userData);
  }
}

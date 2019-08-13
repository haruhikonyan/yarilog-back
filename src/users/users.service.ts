import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { LoginObject } from '../auth/auth.controller';
import * as bcrypt from 'bcrypt';

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

  async findByUsernameOrMailAddressAndPasswordForLogin(loginObject: LoginObject): Promise<User | null> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .where(
        [
          { username: loginObject.loginId },
          { mailAddress: loginObject.loginId }
        ]
      ).addSelect('user.password')
      .getOne();
      if (user == null) {
        throw new HttpException('feild login', HttpStatus.UNAUTHORIZED);
      }
    return await bcrypt.compare(loginObject.password, user.password) ? user : null;
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }
}
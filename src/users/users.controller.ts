import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll(false);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | undefined> {
    // 自分自身の取得は auth#me を使うので isMine は false 固定
    return await this.usersService.findById(id, false);
  }

  @Post()
  async create(@Body() userData: User): Promise<User> {
    userData.password = await bcrypt.hash(userData.password, 5);
    return await this.usersService.save(userData);
  }
}

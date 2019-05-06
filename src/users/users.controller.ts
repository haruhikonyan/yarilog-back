import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findById(id);
  }

  @Post()
  async create(@Body() userData: User): Promise<User> {
    console.log(userData);
    return await this.usersService.save(userData);
  }
}

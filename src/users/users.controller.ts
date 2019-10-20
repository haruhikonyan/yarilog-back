import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('mail-address')
  @UseGuards(AuthGuard('jwt'))
  async updateMaillAddress(
    @Body('mailAddress') mailAddress: string,
    @Request() req: any,
  ): Promise<User> {
    const me: User = req.user;
    me.mailAddress = mailAddress;
    return this.usersService.save(me);
  }

  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  async updateNickname(
    @Body('nickname') nickname: string,
    @Request() req: any,
  ): Promise<User> {
    const me: User = req.user;
    me.nickname = nickname;
    return this.usersService.save(me);
  }

  @Post('description')
  @UseGuards(AuthGuard('jwt'))
  async updateDescription(
    @Body('description') description: string,
    @Request() req: any,
  ): Promise<User> {
    const me: User = req.user;
    me.description = description;
    return this.usersService.save(me);
  }

  @Post('consent-terms')
  @UseGuards(AuthGuard('jwt'))
  async consentTerms(
    @Body('concentTermsId') concentTermsId: number,
    @Request() req: any,
  ): Promise<void> {
    const me: User = req.user;
    me.consentTermsId = concentTermsId;
    await this.usersService.save(me);
  }
}

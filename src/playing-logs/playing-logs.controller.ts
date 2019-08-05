import { Controller, Get, Post, Body, Param, UseGuards, Request, Put, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PlayingLogsService } from './playing-logs.service';
import { PlayingLog } from './playing-logs.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.entity';

@Controller('playing-logs')
export class PlayingLogsController {
  constructor(
    private readonly playingLogService: PlayingLogsService,
    private readonly authService: AuthService,
    ) {}

  @Get()
  async findAll(): Promise<PlayingLog[]> {
    return await this.playingLogService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PlayingLog | null> {
    return await this.playingLogService.findById(id);
  }

  @Get('composers/:id')
  async findAllByComposerId(@Param('id') composerId: string): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByComposerId(composerId);
  }

  @Get('countries/:id')
  async findAllByCountryId(@Param('id') countryId: string): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByCountryId(countryId);
  }

  @Get('instruments/:id')
  async findAllByInstrumentId(@Param('id') instrumentId: string): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByInstrumentId(instrumentId);
  }

  @Get('users/:id')
  async findAllByUserId(@Param('id') userId: string, @Request() req): Promise<PlayingLog[] | null> {
    const me: User = await this.authService.getMeByAuthorizationHeaderToken(req.headers['authorization']);
    if (me.id === userId) {
      // TODO ログイン中の id と一致した場合は非公開情報などを付与する
      return await this.playingLogService.findAllByUserId(userId);
    }
    // TODO デフォルトでは非公開情報を付与しないようにする
    return await this.playingLogService.findAllByUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() playingLogData: PlayingLog, @Request() req): Promise<PlayingLog> {
    playingLogData.user = req.user;
    return await this.playingLogService.save(playingLogData);
  }


  @Put(":id")
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() playingLogData: PlayingLog, @Param('id') id: string, @Request() req): Promise<PlayingLog> {
    if (playingLogData.user.id !== req.user.id) {
      throw new HttpException('更新ユーザ不一致', HttpStatus.UNAUTHORIZED);
    }
    return await this.playingLogService.update(id, playingLogData);
  }

}

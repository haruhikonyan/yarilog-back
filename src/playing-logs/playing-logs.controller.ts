import { Controller, Get, Post, Body, Param, UseGuards, Request, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PlayingLogsService } from './playing-logs.service';
import { PlayingLog } from './playing-logs.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/users.entity';

@Controller('playing-logs')
export class PlayingLogsController {
  constructor(
    private readonly playingLogService: PlayingLogsService,
    private readonly authService: AuthService,
    ) {}

  @Get()
  async findAll(@Query('limit') limit: number, @Query('offset') offset: number): Promise<PlayingLog[]> {
    return await this.playingLogService.findAll(limit, offset);
  }

  @Get('search')
  async findAllBySearchWord(@Query('searchWord') searchWord: string, @Query('limit') limit: number, @Query('offset') offset: number): Promise<PlayingLog[]> {
    return await this.playingLogService.findAllBySearchWord(searchWord, limit, offset);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Request() req: any): Promise<PlayingLog | undefined> {
    // この時点では自分の PlayingLog かはわからないのですべてのカラムを持ったものを取得する
    const allColmunPlayingLog = await this.playingLogService.findById(id, true);

    if (allColmunPlayingLog == null) {
      return undefined;
    }

    const me: User | undefined = await this.authService.getMeByAuthorizationHeaderToken(req.headers['authorization']);

    // userId が一致すればそのまま返す
    if (me && me.id === allColmunPlayingLog.user.id) {
      return allColmunPlayingLog
    }
    // 一致しなければ 非公開情報を削除して返す
    else {
      delete allColmunPlayingLog.secretMemo;
      return allColmunPlayingLog;
    }
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
  async findAllByUserId(@Param('id') userId: string, @Request() req: any): Promise<PlayingLog[]> {
    const me: User | undefined = await this.authService.getMeByAuthorizationHeaderToken(req.headers['authorization']);
    if (me && me.id === userId) {
      // TODO ログイン中の id と一致した場合は非公開情報などを付与する
      return await this.playingLogService.findAllByUserId(userId);
    }
    // TODO デフォルトでは非公開情報を付与しないようにする
    return await this.playingLogService.findAllByUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() playingLogData: PlayingLog, @Request() req: any): Promise<PlayingLog> {
    playingLogData.user = req.user;
    return await this.playingLogService.save(playingLogData);
  }


  @Put(":id")
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() playingLogData: PlayingLog, @Param('id') id: string, @Request() req: any): Promise<PlayingLog | undefined> {
    if (playingLogData.user.id !== req.user.id) {
      throw new HttpException('更新ユーザ不一致', HttpStatus.UNAUTHORIZED);
    }
    return await this.playingLogService.update(id, playingLogData);
  }

}

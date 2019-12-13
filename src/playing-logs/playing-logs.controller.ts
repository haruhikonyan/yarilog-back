import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PlayingLogsService } from './playing-logs.service';
import { PlayingLog } from './playing-logs.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/users.entity';
import { PlayingLogsWithCount } from './PlayingLogsWithCount';

@Controller('playing-logs')
export class PlayingLogsController {
  constructor(
    private readonly playingLogService: PlayingLogsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLog[]> {
    return await this.playingLogService.findAll(limit, offset);
  }

  @Get('search')
  async findAllBySearchWord(
    @Query('searchWord') searchWord: string,
    @Query('instrumentId') instrumentId: string,
    @Query('playstyleId') playstyleId: string,
    @Query('tuneId') tuneId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLogsWithCount> {
    return await this.playingLogService.findAllBySearchWord(
      searchWord,
      instrumentId,
      playstyleId,
      tuneId,
      limit,
      offset,
    );
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<PlayingLog> {
    // この時点では自分の PlayingLog かはわからないのですべてのカラムを持ったものを取得する
    const allColmunPlayingLog = await this.playingLogService.findById(id, true);

    if (allColmunPlayingLog == null) {
      throw new NotFoundException();
    }

    const me:
      | User
      | undefined = await this.authService.getMeByAuthorizationHeaderToken(
      req.headers['authorization'],
    );

    // userId が一致すればそのまま返す
    if (me && me.id === allColmunPlayingLog.user.id) {
      return allColmunPlayingLog;
    }
    // 下書きであれば 404 を返す
    else if (allColmunPlayingLog.isDraft) {
      throw new NotFoundException();
    }
    // 一致しなければ 非公開情報を削除して返す
    else {
      delete allColmunPlayingLog.secretMemo;
      return allColmunPlayingLog;
    }
  }

  @Get('composers/:id')
  async findAllByComposerId(
    @Param('id') composerId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByComposerId(
      composerId,
      limit,
      offset,
    );
  }

  @Get('countries/:id')
  async findAllByCountryId(
    @Param('id') countryId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByCountryId(
      countryId,
      limit,
      offset,
    );
  }

  @Get('instruments/:id')
  async findAllByInstrumentId(
    @Param('id') instrumentId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByInstrumentId(
      instrumentId,
      limit,
      offset,
    );
  }

  @Get('tunes/:id')
  async findAllByTuneId(
    @Param('id') tuneId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<PlayingLog[] | null> {
    return await this.playingLogService.findAllByTuneId(tuneId, limit, offset);
  }

  @Get('users/:id')
  async findAllByUserId(
    @Param('id') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() req: any,
  ): Promise<PlayingLog[]> {
    const me:
      | User
      | undefined = await this.authService.getMeByAuthorizationHeaderToken(
      req.headers['authorization'],
    );

    const isMine: boolean = me != null && me.id === userId;
    return await this.playingLogService.findAllByUserId(
      userId,
      isMine,
      limit,
      offset,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() playingLogData: PlayingLog,
    @Request() req: any,
  ): Promise<PlayingLog> {
    playingLogData.user = req.user;
    return await this.playingLogService.save(playingLogData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() playingLogData: PlayingLog,
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<PlayingLog | undefined> {
    if (playingLogData.user.id !== req.user.id) {
      throw new HttpException('更新ユーザ不一致', HttpStatus.UNAUTHORIZED);
    }
    return await this.playingLogService.update(id, playingLogData);
  }
}

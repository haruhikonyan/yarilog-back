import { Test, TestingModule } from '@nestjs/testing';
import { PlayingLogsService } from './playing-logs.service';

describe('PlayingLogsService', () => {
  let service: PlayingLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayingLogsService],
    }).compile();

    service = module.get<PlayingLogsService>(PlayingLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

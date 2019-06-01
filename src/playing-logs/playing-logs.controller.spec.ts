import { Test, TestingModule } from '@nestjs/testing';
import { PlayingLogsController } from './playing-logs.controller';

describe('PlayingLogs Controller', () => {
  let controller: PlayingLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayingLogsController],
    }).compile();

    controller = module.get<PlayingLogsController>(PlayingLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

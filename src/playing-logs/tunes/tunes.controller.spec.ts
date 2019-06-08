import { Test, TestingModule } from '@nestjs/testing';
import { TunesController } from './tunes.controller';

describe('Tunes Controller', () => {
  let controller: TunesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TunesController],
    }).compile();

    controller = module.get<TunesController>(TunesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

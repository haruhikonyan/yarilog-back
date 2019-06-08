import { Test, TestingModule } from '@nestjs/testing';
import { TunesService } from './tunes.service';

describe('TunesService', () => {
  let service: TunesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TunesService],
    }).compile();

    service = module.get<TunesService>(TunesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

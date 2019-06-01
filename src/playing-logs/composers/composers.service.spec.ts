import { Test, TestingModule } from '@nestjs/testing';
import { ComposersService } from './composers.service';

describe('ComposersService', () => {
  let service: ComposersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComposersService],
    }).compile();

    service = module.get<ComposersService>(ComposersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

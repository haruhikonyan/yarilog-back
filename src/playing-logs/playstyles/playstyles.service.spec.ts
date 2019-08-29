import { Test, TestingModule } from '@nestjs/testing';
import { PlaystylesService } from './playstyles.service';

describe('PlaystylesService', () => {
  let service: PlaystylesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaystylesService],
    }).compile();

    service = module.get<PlaystylesService>(PlaystylesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

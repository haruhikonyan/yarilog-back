import { Test, TestingModule } from '@nestjs/testing';
import { ExtarnalAccountsService } from './extarnal-accounts.service';

describe('ExtarnalAccountsService', () => {
  let service: ExtarnalAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtarnalAccountsService],
    }).compile();

    service = module.get<ExtarnalAccountsService>(ExtarnalAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

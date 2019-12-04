import { Test, TestingModule } from '@nestjs/testing';
import { InquiryTypesService } from './inquiry-types.service';

describe('InquiryTypesService', () => {
  let service: InquiryTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InquiryTypesService],
    }).compile();

    service = module.get<InquiryTypesService>(InquiryTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

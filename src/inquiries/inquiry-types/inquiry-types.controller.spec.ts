import { Test, TestingModule } from '@nestjs/testing';
import { InquiryTypesController } from './inquiry-types.controller';

describe('InquiryTypes Controller', () => {
  let controller: InquiryTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiryTypesController],
    }).compile();

    controller = module.get<InquiryTypesController>(InquiryTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

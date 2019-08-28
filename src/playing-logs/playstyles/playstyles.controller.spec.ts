import { Test, TestingModule } from '@nestjs/testing';
import { PlaystylesController } from './playstyles.controller';

describe('Playstyles Controller', () => {
  let controller: PlaystylesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaystylesController],
    }).compile();

    controller = module.get<PlaystylesController>(PlaystylesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

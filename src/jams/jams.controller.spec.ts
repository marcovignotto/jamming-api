import { Test, TestingModule } from '@nestjs/testing';
import { JamsController } from './jams.controller';

describe('JamsController', () => {
  let controller: JamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JamsController],
    }).compile();

    controller = module.get<JamsController>(JamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

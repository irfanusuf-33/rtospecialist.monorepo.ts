import { Test, TestingModule } from '@nestjs/testing';
import { LogTrailsController } from './log-trails.controller';
import { LogTrailsService } from './log-trails.service';

describe('LogTrailsController', () => {
  let controller: LogTrailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogTrailsController],
      providers: [LogTrailsService],
    }).compile();

    controller = module.get<LogTrailsController>(LogTrailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

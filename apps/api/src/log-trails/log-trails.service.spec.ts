import { Test, TestingModule } from '@nestjs/testing';
import { LogTrailsService } from './log-trails.service';

describe('LogTrailsService', () => {
  let service: LogTrailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogTrailsService],
    }).compile();

    service = module.get<LogTrailsService>(LogTrailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

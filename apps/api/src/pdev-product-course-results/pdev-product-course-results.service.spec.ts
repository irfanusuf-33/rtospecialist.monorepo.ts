import { Test, TestingModule } from '@nestjs/testing';
import { PdevProductCourseResultsService } from './pdev-product-course-results.service';

describe('PdevProductCourseResultsService', () => {
  let service: PdevProductCourseResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdevProductCourseResultsService],
    }).compile();

    service = module.get<PdevProductCourseResultsService>(PdevProductCourseResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

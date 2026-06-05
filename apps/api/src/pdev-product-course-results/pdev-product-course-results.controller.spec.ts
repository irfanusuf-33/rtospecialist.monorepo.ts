import { Test, TestingModule } from '@nestjs/testing';
import { PdevProductCourseResultsController } from './pdev-product-course-results.controller';
import { PdevProductCourseResultsService } from './pdev-product-course-results.service';

describe('PdevProductCourseResultsController', () => {
  let controller: PdevProductCourseResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdevProductCourseResultsController],
      providers: [PdevProductCourseResultsService],
    }).compile();

    controller = module.get<PdevProductCourseResultsController>(PdevProductCourseResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

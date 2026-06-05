import { Test, TestingModule } from '@nestjs/testing';
import { HelpAndSupportController } from './help-and-support.controller';
import { HelpAndSupportService } from './help-and-support.service';

describe('HelpAndSupportController', () => {
  let controller: HelpAndSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpAndSupportController],
      providers: [HelpAndSupportService],
    }).compile();

    controller = module.get<HelpAndSupportController>(HelpAndSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

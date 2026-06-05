import { Test, TestingModule } from '@nestjs/testing';
import { PdevUserController } from './pdev-user.controller';
import { PdevUserService } from './pdev-user.service';

describe('PdevUserController', () => {
  let controller: PdevUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdevUserController],
      providers: [PdevUserService],
    }).compile();

    controller = module.get<PdevUserController>(PdevUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

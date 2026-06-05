import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateUserController } from './affiliate-user.controller';
import { AffiliateUserService } from './affiliate-user.service';

describe('AffiliateUserController', () => {
  let controller: AffiliateUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateUserController],
      providers: [AffiliateUserService],
    }).compile();

    controller = module.get<AffiliateUserController>(AffiliateUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

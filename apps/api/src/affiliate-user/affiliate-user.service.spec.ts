import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateUsersService } from './affiliate-user.service';

describe('AffiliateUsersService', () => {
  let service: AffiliateUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffiliateUsersService],
    }).compile();

    service = module.get<AffiliateUsersService>(AffiliateUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

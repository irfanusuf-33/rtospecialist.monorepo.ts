import { Test, TestingModule } from '@nestjs/testing';
import { PdevUsersService } from './pdev-user.service';

describe('PdevUsersService', () => {
  let service: PdevUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdevUsersService],
    }).compile();

    service = module.get<PdevUsersService>(PdevUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

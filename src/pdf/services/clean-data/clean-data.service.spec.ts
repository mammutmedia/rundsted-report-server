import { Test, TestingModule } from '@nestjs/testing';
import { CleanDataService } from './clean-data.service';

describe('CleanDataService', () => {
  let service: CleanDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanDataService],
    }).compile();

    service = module.get<CleanDataService>(CleanDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

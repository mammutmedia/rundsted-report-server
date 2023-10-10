import { Test, TestingModule } from '@nestjs/testing';
import { CreateChartsService } from './create-charts.service';

describe('CreateChartsService', () => {
  let service: CreateChartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateChartsService],
    }).compile();

    service = module.get<CreateChartsService>(CreateChartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

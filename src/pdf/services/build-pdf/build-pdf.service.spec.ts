import { Test, TestingModule } from '@nestjs/testing';
import { BuildPdfService } from './build-pdf.service';

describe('BuildPdfService', () => {
  let service: BuildPdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildPdfService],
    }).compile();

    service = module.get<BuildPdfService>(BuildPdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

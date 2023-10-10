import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KompetenzDto } from './kompetenz.dto';

export class CleanDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KompetenzDto)
  klient: KompetenzDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KompetenzDto)
  stakeholder: KompetenzDto[];
}

import {
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class KlientDto {
  @IsNotEmpty()
  @IsString()
  reportId: string;

  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(25)
  @ArrayMaxSize(25)
  ergebnis: Object[];
}

class StakeholderDto {
  @IsNotEmpty()
  @IsString()
  reportId: string;

  @IsArray()
  @ArrayMinSize(25)
  @ArrayMaxSize(25)
  ergebnis: Array<any>;
}

export class CreateReportDto {
  @ValidateNested()
  @Type(() => KlientDto)
  klient: KlientDto;

  @ValidateNested({ each: true })
  @ArrayMinSize(2) // at least 2 stakeholders
  @Type(() => StakeholderDto)
  stakeholder: StakeholderDto[];
  language: Language;
}

import {
  IsString,
  IsInt,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SkillDto {
  @IsString()
  skill: string;

  @IsNumber()
  value: number;
}

export class KompetenzDto {
  @IsString()
  kompetenz: string;

  @IsNumber()
  sum: number;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills: SkillDto[];

  @IsNumber()
  averageRating: number;
}

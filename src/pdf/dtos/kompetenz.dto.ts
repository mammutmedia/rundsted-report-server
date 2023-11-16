import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SkillItemDto {
  @IsNumber()
  rating: number;

  @IsString()
  skillName: string;

  // Add more language-specific properties if needed
  @IsString()
  de: string;

  @IsString()
  en: string;

  @IsString()
  it: string;

  @IsString()
  fr: string;
}

export class KompetenzDto {
  @IsString()
  kompetenz: string;

  @IsNumber()
  sum: number;

  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills: SkillItemDto[];

  @IsNumber()
  averageRating: number;

  @IsNumber()
  percentage: number;

  // Top-level language properties
  @IsString()
  de: string;

  @IsString()
  en: string;

  @IsString()
  it: string;

  @IsString()
  fr: string;
}

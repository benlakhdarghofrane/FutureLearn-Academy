import { IsString, IsOptional, IsArray, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class FeatureItemDto {
  @IsString() title: string;
  @IsString() description: string;
}

class TestimonialItemDto {
  @IsString() name: string;
  @IsString() role: string;
  @IsString() text: string;
}

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  siteName?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  heroBadge?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  heroTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  heroTitleHighlight?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  heroDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  ctaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  ctaDescription?: string;

  @ApiProperty({ required: false, type: [FeatureItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => FeatureItemDto)
  features?: FeatureItemDto[];

  @ApiProperty({ required: false, type: [TestimonialItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => TestimonialItemDto)
  testimonials?: TestimonialItemDto[];

  @ApiProperty({ required: false })
  @IsOptional() @IsEmail()
  contactEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  contactPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  footerTagline?: string;
}

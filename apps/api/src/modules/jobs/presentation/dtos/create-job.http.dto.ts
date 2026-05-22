import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

import { EmploymentType } from '../../domain/value-objects/employment-type.vo';

export class CreateJobHttpDto {
  @IsUUID() employerId!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() specialization!: string;
  @IsEnum(EmploymentType) employmentType!: EmploymentType;
  @IsOptional() @IsInt() @Min(0) salaryMin?: number;
  @IsOptional() @IsInt() @Min(0) salaryMax?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
}

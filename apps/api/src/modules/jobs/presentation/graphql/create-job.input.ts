import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { SalaryPeriod } from '../../domain/value-objects/salary-period.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

@InputType()
export class CreateJobInputType {

  @Field() @IsString() title!: string;
  @Field() @IsString() description!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() summary?: string;
  @Field() @IsString() specialization!: string;
  @Field(() => EmploymentType) @IsEnum(EmploymentType) employmentType!: EmploymentType;
  @Field(() => Shift, { nullable: true }) @IsOptional() @IsEnum(Shift) shift?: Shift;
  @Field({ nullable: true }) @IsOptional() @IsString() experience?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) salaryMin?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) salaryMax?: number;
  @Field(() => SalaryPeriod, { nullable: true }) @IsOptional() @IsEnum(SalaryPeriod) salaryPeriod?: SalaryPeriod;
  @Field({ nullable: true }) @IsOptional() @IsString() currency?: string;
  @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() @IsString({ each: true }) requirements?: string[];
  @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() @IsString({ each: true }) benefits?: string[];
  @Field({ nullable: true }) @IsOptional() @IsString() city?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() country?: string;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() remote?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() urgent?: boolean;
}

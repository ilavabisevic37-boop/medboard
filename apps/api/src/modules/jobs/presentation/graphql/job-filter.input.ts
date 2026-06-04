import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

@InputType()
export class JobFilterInput {
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() specialization?: string;
  @Field(() => EmploymentType, { nullable: true }) @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @Field(() => Shift, { nullable: true }) @IsOptional() @IsEnum(Shift) shift?: Shift;
  @Field({ nullable: true }) @IsOptional() @IsString() city?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() country?: string;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() remote?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() urgent?: boolean;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) salaryMin?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(1) limit?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) offset?: number;
}

import { Field, GraphQLISODateTime, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { SalaryPeriod } from '../../domain/value-objects/salary-period.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

// Surface the domain enums in the generated SDL.
registerEnumType(EmploymentType, { name: 'EmploymentType' });
registerEnumType(Shift, { name: 'Shift' });
registerEnumType(SalaryPeriod, { name: 'SalaryPeriod' });

@ObjectType()
export class JobType {
  @Field(() => ID) id!: string;
  @Field() title!: string;
  @Field({ nullable: true }) summary?: string;
  @Field() specialization!: string;
  @Field(() => EmploymentType) employmentType!: EmploymentType;
  @Field(() => Shift, { nullable: true }) shift?: Shift;
  @Field({ nullable: true }) city?: string;
  @Field({ nullable: true }) country?: string;
  @Field() remote!: boolean;
  @Field() urgent!: boolean;
  @Field(() => Int, { nullable: true }) salaryMin?: number;
  @Field(() => Int, { nullable: true }) salaryMax?: number;
  @Field(() => SalaryPeriod) salaryPeriod!: SalaryPeriod;
  @Field() currency!: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) publishedAt?: Date;
}

@ObjectType()
export class JobDetailType extends JobType {
  @Field() description!: string;
  @Field({ nullable: true }) experience?: string;
  @Field(() => [String]) requirements!: string[];
  @Field(() => [String]) benefits!: string[];
  @Field(() => ID) employerId!: string;
  @Field() status!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
}

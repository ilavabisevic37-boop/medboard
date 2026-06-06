import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('DoctorProfile')
export class DoctorProfileType {
  @Field(() => ID)
  id!: string;

  @Field()
  specialization!: string;

  @Field(() => Int)
  yearsOfExp!: number;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  licenseNumber?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;
}

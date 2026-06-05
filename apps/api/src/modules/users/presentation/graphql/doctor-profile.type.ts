import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('DoctorProfile')
export class DoctorProfileType {
  @Field(() => ID)
  id!: string;

  @Field()
  specialization!: string;

  @Field(() => Int)
  yearsOfExp!: number;

  @Field({ nullable: true })
  bio?: string | null;

  @Field({ nullable: true })
  licenseNumber?: string | null;

  @Field({ nullable: true })
  city?: string | null;

  @Field({ nullable: true })
  country?: string | null;
}

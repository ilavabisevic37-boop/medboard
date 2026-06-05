import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDoctorProfileInput {
  @Field({ nullable: true })
  specialization?: string;

  @Field(() => Int, { nullable: true })
  yearsOfExp?: number;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  licenseNumber?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;
}

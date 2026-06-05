import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateEmployerProfileInput {
  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;
}

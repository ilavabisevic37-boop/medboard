import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('EmployerProfile')
export class EmployerProfileType {
  @Field(() => ID)
  id!: string;

  @Field()
  companyName!: string;

  @Field(() => String, { nullable: true })
  website?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;
}

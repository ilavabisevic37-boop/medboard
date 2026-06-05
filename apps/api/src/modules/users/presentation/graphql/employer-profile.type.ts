import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('EmployerProfile')
export class EmployerProfileType {
  @Field(() => ID)
  id!: string;

  @Field()
  companyName!: string;

  @Field({ nullable: true })
  website?: string | null;

  @Field({ nullable: true })
  description?: string | null;

  @Field({ nullable: true })
  city?: string | null;

  @Field({ nullable: true })
  country?: string | null;
}

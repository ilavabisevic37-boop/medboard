import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@medboard/shared-types';
import { DoctorProfileType } from './doctor-profile.type';
import { EmployerProfileType } from './employer-profile.type';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field(() => String)
  role!: UserRole;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  createdAt!: Date;

  @Field(() => DoctorProfileType, { nullable: true })
  doctorProfile?: DoctorProfileType | null;

  @Field(() => EmployerProfileType, { nullable: true })
  employerProfile?: EmployerProfileType | null;
}

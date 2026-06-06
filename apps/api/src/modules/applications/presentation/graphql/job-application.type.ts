import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { ApplicationStatus } from '../../domain/value-objects/application-status.vo';
import { JobDetailType } from '../../../jobs/presentation/graphql/job.type';
import { UserType } from '../../../users/presentation/graphql/user.type';

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });

@ObjectType('JobApplication')
export class JobApplicationType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  jobId!: string;

  @Field(() => ID)
  doctorId!: string;

  @Field({ nullable: true })
  coverLetter?: string;

  @Field(() => ApplicationStatus)
  status!: ApplicationStatus;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => JobDetailType)
  job?: JobDetailType;

  @Field(() => UserType)
  doctor?: UserType;
}

import { Module } from '@nestjs/common';

import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { GetJobDetailUseCase } from './application/use-cases/get-job-detail.use-case';
import { SearchJobsUseCase } from './application/use-cases/search-jobs.use-case';
import { JOB_REPOSITORY } from './domain/repositories/job.repository';
import { PrismaJobRepository } from './infrastructure/persistence/prisma-job.repository';
import { JobsResolver } from './presentation/graphql/jobs.resolver';

@Module({
  providers: [
    CreateJobUseCase,
    SearchJobsUseCase,
    GetJobDetailUseCase,
    JobsResolver,
    { provide: JOB_REPOSITORY, useClass: PrismaJobRepository },
  ],
  exports: [JOB_REPOSITORY],
})
export class JobsModule {}

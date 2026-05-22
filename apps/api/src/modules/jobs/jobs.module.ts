import { Module } from '@nestjs/common';

import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { SearchJobsUseCase } from './application/use-cases/search-jobs.use-case';
import { JOB_REPOSITORY } from './domain/repositories/job.repository';
import { PrismaJobRepository } from './infrastructure/persistence/prisma-job.repository';
import { JobsController } from './presentation/jobs.controller';

@Module({
  controllers: [JobsController],
  providers: [
    CreateJobUseCase,
    SearchJobsUseCase,
    { provide: JOB_REPOSITORY, useClass: PrismaJobRepository },
  ],
  exports: [JOB_REPOSITORY],
})
export class JobsModule {}

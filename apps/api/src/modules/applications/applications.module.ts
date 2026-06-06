import { Module } from '@nestjs/common';

import { JobsModule } from '../jobs/jobs.module';
import { ApplyToJobUseCase } from './application/use-cases/apply-to-job.use-case';
import { GetDoctorApplicationsUseCase } from './application/use-cases/get-doctor-applications.use-case';
import { GetJobApplicationsUseCase } from './application/use-cases/get-job-applications.use-case';
import { UpdateApplicationStatusUseCase } from './application/use-cases/update-application-status.use-case';
import { WithdrawApplicationUseCase } from './application/use-cases/withdraw-application.use-case';
import { JOB_APPLICATION_REPOSITORY } from './domain/repositories/job-application.repository';
import { PrismaJobApplicationRepository } from './infrastructure/persistence/prisma-job-application.repository';
import { ApplicationsResolver } from './presentation/graphql/applications.resolver';

@Module({
  imports: [JobsModule],
  providers: [
    ApplyToJobUseCase,
    WithdrawApplicationUseCase,
    UpdateApplicationStatusUseCase,
    GetDoctorApplicationsUseCase,
    GetJobApplicationsUseCase,
    ApplicationsResolver,
    { provide: JOB_APPLICATION_REPOSITORY, useClass: PrismaJobApplicationRepository },
  ],
})
export class ApplicationsModule {}


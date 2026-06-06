import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';
import { JOB_REPOSITORY, JobRepository } from '../../../jobs/domain/repositories/job.repository';

export interface GetJobApplicationsInput {
  jobId: string;
  employerId: string;
}

@Injectable()
export class GetJobApplicationsUseCase implements UseCase<GetJobApplicationsInput, JobApplication[]> {
  constructor(
    @Inject(JOB_APPLICATION_REPOSITORY)
    private readonly applications: JobApplicationRepository,
    @Inject(JOB_REPOSITORY)
    private readonly jobs: JobRepository,
  ) {}

  async execute(input: GetJobApplicationsInput): Promise<JobApplication[]> {
    const job = await this.jobs.findById(input.jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.employerId !== input.employerId) {
      throw new ForbiddenException('You are not authorized to view applications for this job');
    }

    return this.applications.findByJobId(input.jobId);
  }
}

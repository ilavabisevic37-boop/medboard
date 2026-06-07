import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';
import { JOB_REPOSITORY, JobRepository } from '../../../jobs/domain/repositories/job.repository';
import { assertJobOwner } from '../../../jobs/application/guards/assert-job-owner';

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

    assertJobOwner(job, input.employerId);

    return this.applications.findByJobId(input.jobId);
  }
}

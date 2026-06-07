import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';
import { JOB_REPOSITORY, JobRepository } from '../../../jobs/domain/repositories/job.repository';
import { ApplicationStatus } from '../../domain/value-objects/application-status.vo';
import { assertJobOwner } from '../../../jobs/application/guards/assert-job-owner';

export interface UpdateApplicationStatusInput {
  id: string;
  employerId: string;
  status: ApplicationStatus;
}

@Injectable()
export class UpdateApplicationStatusUseCase implements UseCase<UpdateApplicationStatusInput, void> {
  constructor(
    @Inject(JOB_APPLICATION_REPOSITORY)
    private readonly applications: JobApplicationRepository,
    @Inject(JOB_REPOSITORY)
    private readonly jobs: JobRepository,
  ) {}

  async execute(input: UpdateApplicationStatusInput): Promise<void> {
    const application = await this.applications.findById(input.id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const job = await this.jobs.findById(application.jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    assertJobOwner(job, input.employerId);

    application.updateStatus(input.status);
    await this.applications.save(application);
  }
}

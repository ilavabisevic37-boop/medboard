import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';
import { JOB_REPOSITORY, JobRepository } from '../../../jobs/domain/repositories/job.repository';

export interface ApplyToJobInput {
  jobId: string;
  doctorId: string;
  coverLetter?: string;
}

@Injectable()
export class ApplyToJobUseCase implements UseCase<ApplyToJobInput, { id: string }> {
  constructor(
    @Inject(JOB_APPLICATION_REPOSITORY)
    private readonly applications: JobApplicationRepository,
    @Inject(JOB_REPOSITORY)
    private readonly jobs: JobRepository,
  ) {}

  async execute(input: ApplyToJobInput): Promise<{ id: string }> {
    const job = await this.jobs.findById(input.jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.applications.findByJobAndDoctor(input.jobId, input.doctorId);
    if (existing) {
      throw new BadRequestException('You have already applied to this job');
    }

    const application = JobApplication.create({
      id: randomUUID(),
      jobId: input.jobId,
      doctorId: input.doctorId,
      coverLetter: input.coverLetter,
    });

    await this.applications.save(application);
    return { id: application.id };
  }
}

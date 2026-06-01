import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JobStatus } from '../../domain/value-objects/job-status.vo';
import { JOB_REPOSITORY, JobRepository } from '../../domain/repositories/job.repository';
import { JobDetailReadModel, toJobDetail } from '../read-models/job.read-model';

@Injectable()
export class GetJobDetailUseCase implements UseCase<string, JobDetailReadModel> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobs: JobRepository) {}

  async execute(id: string): Promise<JobDetailReadModel> {
    const job = await this.jobs.findById(id);

    // Public detail page only surfaces published jobs; drafts/archived are 404.
    // TODO: relax this once an owner/admin view needs to read non-published jobs.
    if (!job || job.status !== JobStatus.PUBLISHED) {
      throw new NotFoundException('Job not found');
    }

    return toJobDetail(job);
  }
}

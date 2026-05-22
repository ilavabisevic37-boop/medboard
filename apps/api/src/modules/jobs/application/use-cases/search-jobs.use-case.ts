import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  JOB_REPOSITORY,
  JobRepository,
  JobSearchCriteria,
} from '../../domain/repositories/job.repository';

@Injectable()
export class SearchJobsUseCase implements UseCase<JobSearchCriteria, unknown[]> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobs: JobRepository) {}

  async execute(criteria: JobSearchCriteria): Promise<unknown[]> {
    const list = await this.jobs.search({ ...criteria, publishedOnly: true });
    return list.map((j) => ({
      id: j.id,
      title: j.title,
      specialization: j.specialization,
      employmentType: j.employmentType,
      city: j.city,
      country: j.country,
      publishedAt: j.publishedAt,
    }));
  }
}

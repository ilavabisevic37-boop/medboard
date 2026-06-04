import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  JOB_REPOSITORY,
  JobRepository,
  JobSearchCriteria,
} from '../../domain/repositories/job.repository';
import { JobSummaryReadModel, toJobSummary } from '../read-models/job.read-model';

@Injectable()
export class SearchJobsUseCase implements UseCase<JobSearchCriteria, JobSummaryReadModel[]> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobs: JobRepository) {}

  async execute(criteria: JobSearchCriteria): Promise<JobSummaryReadModel[]> {
    // Public feed only ever exposes published jobs.
    const list = await this.jobs.search({ ...criteria, publishedOnly: true });
    return list.map(toJobSummary);
  }
}

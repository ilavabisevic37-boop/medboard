import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { Job } from '../../domain/entities/job.entity';
import { JOB_REPOSITORY, JobRepository } from '../../domain/repositories/job.repository';
import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { SalaryRange } from '../../domain/value-objects/salary-range.vo';

export interface CreateJobInput {
  employerId: string;
  title: string;
  description: string;
  specialization: string;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  city?: string;
  country?: string;
}

@Injectable()
export class CreateJobUseCase implements UseCase<CreateJobInput, { id: string }> {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobs: JobRepository) {}

  async execute(input: CreateJobInput): Promise<{ id: string }> {
    const salary =
      input.salaryMin != null && input.salaryMax != null
        ? SalaryRange.create(input.salaryMin, input.salaryMax, input.currency)
        : undefined;

    const job = Job.draft({
      id: randomUUID(),
      employerId: input.employerId,
      title: input.title,
      description: input.description,
      specialization: input.specialization,
      employmentType: input.employmentType,
      salary,
      city: input.city,
      country: input.country,
    });

    await this.jobs.save(job);
    return { id: job.id };
  }
}

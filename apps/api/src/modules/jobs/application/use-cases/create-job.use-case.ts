import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { Job } from '../../domain/entities/job.entity';
import { JOB_REPOSITORY, JobRepository } from '../../domain/repositories/job.repository';
import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { SalaryPeriod } from '../../domain/value-objects/salary-period.vo';
import { SalaryRange } from '../../domain/value-objects/salary-range.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

export interface CreateJobInput {
  // TODO(auth): derive employerId from the authenticated employer in the GraphQL
  // context once the auth module lands, instead of trusting it from the client.
  employerId: string;
  title: string;
  description: string;
  summary?: string;
  specialization: string;
  employmentType: EmploymentType;
  shift?: Shift;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
  currency?: string;
  requirements?: string[];
  benefits?: string[];
  city?: string;
  country?: string;
  remote?: boolean;
  urgent?: boolean;
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
      summary: input.summary,
      specialization: input.specialization,
      employmentType: input.employmentType,
      shift: input.shift,
      experience: input.experience,
      salary,
      salaryPeriod: input.salaryPeriod,
      requirements: input.requirements,
      benefits: input.benefits,
      city: input.city,
      country: input.country,
      remote: input.remote,
      urgent: input.urgent,
    });

    await this.jobs.save(job);
    return { id: job.id };
  }
}

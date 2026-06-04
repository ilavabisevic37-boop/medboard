import { Job } from '../../domain/entities/job.entity';
import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { JobStatus } from '../../domain/value-objects/job-status.vo';
import { SalaryPeriod } from '../../domain/value-objects/salary-period.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

/**
 * Read-models — the shape use-cases hand back to the presentation layer
 * (GraphQL resolvers / controllers). Kept separate from domain entities so the
 * transport contract can evolve without leaking the aggregate's internals.
 */
export interface JobSummaryReadModel {
  id: string;
  title: string;
  summary?: string;
  specialization: string;
  employmentType: EmploymentType;
  shift?: Shift;
  city?: string;
  country?: string;
  remote: boolean;
  urgent: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod: SalaryPeriod;
  currency: string;
  publishedAt?: Date;
}

export interface JobDetailReadModel extends JobSummaryReadModel {
  description: string;
  experience?: string;
  requirements: string[];
  benefits: string[];
  employerId: string;
  status: JobStatus;
  createdAt: Date;
}

export function toJobSummary(job: Job): JobSummaryReadModel {
  return {
    id: job.id,
    title: job.title,
    summary: job.summary,
    specialization: job.specialization,
    employmentType: job.employmentType,
    shift: job.shift,
    city: job.city,
    country: job.country,
    remote: job.remote,
    urgent: job.urgent,
    salaryMin: job.salary?.min,
    salaryMax: job.salary?.max,
    salaryPeriod: job.salaryPeriod,
    currency: job.salary?.currency ?? 'USD',
    publishedAt: job.publishedAt,
  };
}

export function toJobDetail(job: Job): JobDetailReadModel {
  return {
    ...toJobSummary(job),
    description: job.description,
    experience: job.experience,
    requirements: job.requirements,
    benefits: job.benefits,
    employerId: job.employerId,
    status: job.status,
    createdAt: job.createdAt,
  };
}

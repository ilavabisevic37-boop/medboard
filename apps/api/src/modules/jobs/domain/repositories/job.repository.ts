import { Job } from '../entities/job.entity';
import { EmploymentType } from '../value-objects/employment-type.vo';
import { Shift } from '../value-objects/shift.vo';

export interface JobSearchCriteria {
  /** Free-text search across title / specialization (TODO: refine matching strategy). */
  query?: string;
  specialization?: string;
  employmentType?: EmploymentType;
  shift?: Shift;
  city?: string;
  country?: string;
  remote?: boolean;
  urgent?: boolean;
  salaryMin?: number;
  publishedOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  search(criteria: JobSearchCriteria): Promise<Job[]>;
  save(job: Job): Promise<void>;
  delete(id: string): Promise<void>;
}

export const JOB_REPOSITORY = Symbol('JobRepository');

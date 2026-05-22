import { Job } from '../entities/job.entity';

export interface JobSearchCriteria {
  specialization?: string;
  city?: string;
  country?: string;
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

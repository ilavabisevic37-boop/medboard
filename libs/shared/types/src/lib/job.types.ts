export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'LOCUM' | 'INTERNSHIP';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type Shift = 'DAY' | 'NIGHT' | 'ROTATING' | 'WEEKEND';
export type SalaryPeriod = 'YEAR' | 'WEEK' | 'HOUR';

export interface JobSummary {
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
  publishedAt?: string;
}

export interface JobDetail extends JobSummary {
  description: string;
  experience?: string;
  requirements: string[];
  benefits: string[];
  employerId: string;
  status: JobStatus;
  createdAt: string;
}

export interface JobFilter {
  query?: string;
  specialization?: string;
  employmentType?: EmploymentType;
  shift?: Shift;
  city?: string;
  country?: string;
  remote?: boolean;
  urgent?: boolean;
  salaryMin?: number;
  limit?: number;
  offset?: number;
}

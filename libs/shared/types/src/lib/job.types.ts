export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'LOCUM' | 'INTERNSHIP';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export interface JobSummary {
  id: string;
  title: string;
  specialization: string;
  employmentType: EmploymentType;
  city?: string;
  country?: string;
  publishedAt?: string;
}

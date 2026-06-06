import { JobApplication } from '../entities/job-application.entity';

export interface JobApplicationRepository {
  findById(id: string): Promise<JobApplication | null>;
  findByJobAndDoctor(jobId: string, doctorId: string): Promise<JobApplication | null>;
  findByDoctorId(doctorId: string): Promise<JobApplication[]>;
  findByJobId(jobId: string): Promise<JobApplication[]>;
  save(application: JobApplication): Promise<void>;
}

export const JOB_APPLICATION_REPOSITORY = Symbol('JobApplicationRepository');

import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';

@Injectable()
export class GetDoctorApplicationsUseCase implements UseCase<string, JobApplication[]> {
  constructor(
    @Inject(JOB_APPLICATION_REPOSITORY)
    private readonly applications: JobApplicationRepository,
  ) {}

  async execute(doctorId: string): Promise<JobApplication[]> {
    return this.applications.findByDoctorId(doctorId);
  }
}

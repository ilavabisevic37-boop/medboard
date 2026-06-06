import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { JOB_APPLICATION_REPOSITORY, JobApplicationRepository } from '../../domain/repositories/job-application.repository';

export interface WithdrawApplicationInput {
  id: string;
  doctorId: string;
}

@Injectable()
export class WithdrawApplicationUseCase implements UseCase<WithdrawApplicationInput, void> {
  constructor(
    @Inject(JOB_APPLICATION_REPOSITORY)
    private readonly applications: JobApplicationRepository,
  ) {}

  async execute(input: WithdrawApplicationInput): Promise<void> {
    const application = await this.applications.findById(input.id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.doctorId !== input.doctorId) {
      throw new ForbiddenException('You can only withdraw your own applications');
    }

    application.withdraw();
    await this.applications.save(application);
  }
}

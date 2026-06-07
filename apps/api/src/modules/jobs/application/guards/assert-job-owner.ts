import { ForbiddenException } from '@nestjs/common';

export function assertJobOwner(job: { employerId: string }, userId: string): void {
  if (job.employerId !== userId) {
    throw new ForbiddenException('You are not authorized to access this job');
  }
}

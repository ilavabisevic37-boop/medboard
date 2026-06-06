import { JobApplication as PrismaJobApplication } from '@prisma/client';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { ApplicationStatus } from '../../domain/value-objects/application-status.vo';

export class JobApplicationMapper {
  static toDomain(row: PrismaJobApplication): JobApplication {
    return JobApplication.restore(row.id, {
      jobId: row.jobId,
      doctorId: row.doctorId,
      coverLetter: row.coverLetter ?? undefined,
      status: row.status as unknown as ApplicationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

import { Job as PrismaJob } from '@prisma/client';

import { Job } from '../../domain/entities/job.entity';
import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { JobStatus } from '../../domain/value-objects/job-status.vo';
import { SalaryRange } from '../../domain/value-objects/salary-range.vo';

export class JobMapper {
  static toDomain(row: PrismaJob): Job {
    return Job.restore(row.id, {
      employerId: row.employerId,
      title: row.title,
      description: row.description,
      specialization: row.specialization,
      employmentType: row.employmentType as unknown as EmploymentType,
      salary:
        row.salaryMin != null && row.salaryMax != null
          ? SalaryRange.create(row.salaryMin, row.salaryMax, row.currency)
          : undefined,
      city: row.city ?? undefined,
      country: row.country ?? undefined,
      status: row.status as unknown as JobStatus,
      publishedAt: row.publishedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

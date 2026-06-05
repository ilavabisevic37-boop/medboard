import { Job as PrismaJob } from '@prisma/client';

import { Job } from '../../domain/entities/job.entity';
import { EmploymentType } from '../../domain/value-objects/employment-type.vo';
import { JobStatus } from '../../domain/value-objects/job-status.vo';
import { SalaryPeriod } from '../../domain/value-objects/salary-period.vo';
import { SalaryRange } from '../../domain/value-objects/salary-range.vo';
import { Shift } from '../../domain/value-objects/shift.vo';

export class JobMapper {
  static toDomain(row: PrismaJob): Job {
    return Job.restore(row.id, {
      employerId: row.employerId,
      title: row.title,
      description: row.description,
      summary: row.summary ?? undefined,
      specialization: row.specialization,
      employmentType: row.employmentType as unknown as EmploymentType,
      shift: (row.shift as unknown as Shift) ?? undefined,
      experience: row.experience ?? undefined,
      salary:
        row.salaryMin != null && row.salaryMax != null
          ? SalaryRange.create(row.salaryMin, row.salaryMax, row.currency)
          : undefined,
      salaryPeriod: row.salaryPeriod as unknown as SalaryPeriod,
      requirements: row.requirements,
      benefits: row.benefits,
      city: row.city ?? undefined,
      country: row.country ?? undefined,
      remote: row.remote,
      urgent: row.urgent,
      status: row.status as unknown as JobStatus,
      publishedAt: row.publishedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

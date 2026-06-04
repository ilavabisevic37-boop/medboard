import { Injectable } from '@nestjs/common';
import {
  JobStatus as PrismaJobStatus,
  EmploymentType as PrismaEmploymentType,
  Shift as PrismaShift,
  SalaryPeriod as PrismaSalaryPeriod,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { Job } from '../../domain/entities/job.entity';
import { JobRepository, JobSearchCriteria } from '../../domain/repositories/job.repository';
import { JobMapper } from './job.mapper';

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Job | null> {
    const row = await this.prisma.job.findUnique({ where: { id } });
    return row ? JobMapper.toDomain(row) : null;
  }

  async search(criteria: JobSearchCriteria): Promise<Job[]> {
    const where: Prisma.JobWhereInput = {
      ...(criteria.publishedOnly ? { status: PrismaJobStatus.PUBLISHED } : {}),
      ...(criteria.specialization ? { specialization: criteria.specialization } : {}),
      ...(criteria.employmentType
        ? { employmentType: criteria.employmentType as unknown as PrismaEmploymentType }
        : {}),
      ...(criteria.shift ? { shift: criteria.shift as unknown as PrismaShift } : {}),
      ...(criteria.city ? { city: criteria.city } : {}),
      ...(criteria.country ? { country: criteria.country } : {}),
      ...(criteria.remote != null ? { remote: criteria.remote } : {}),
      ...(criteria.urgent != null ? { urgent: criteria.urgent } : {}),
      ...(criteria.salaryMin != null ? { salaryMax: { gte: criteria.salaryMin } } : {}),
      ...(criteria.query
        ? {
            OR: [
              { title: { contains: criteria.query, mode: 'insensitive' } },
              { specialization: { contains: criteria.query, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.job.findMany({
      where,
      take: criteria.limit ?? 20,
      skip: criteria.offset ?? 0,
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map(JobMapper.toDomain);
  }

  async save(job: Job): Promise<void> {
    const data = {
      id: job.id,
      employerId: job.employerId,
      title: job.title,
      description: job.description,
      summary: job.summary ?? null,
      specialization: job.specialization,
      employmentType: job.employmentType as unknown as PrismaEmploymentType,
      shift: (job.shift as unknown as PrismaShift) ?? null,
      experience: job.experience ?? null,
      salaryMin: job.salary?.min ?? null,
      salaryMax: job.salary?.max ?? null,
      salaryPeriod: job.salaryPeriod as unknown as PrismaSalaryPeriod,
      currency: job.salary?.currency ?? 'USD',
      requirements: job.requirements,
      benefits: job.benefits,
      city: job.city ?? null,
      country: job.country ?? null,
      remote: job.remote,
      urgent: job.urgent,
      status: job.status as unknown as PrismaJobStatus,
      publishedAt: job.publishedAt ?? null,
    };
    await this.prisma.job.upsert({
      where: { id: job.id },
      create: data,
      update: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.job.delete({ where: { id } });
  }
}

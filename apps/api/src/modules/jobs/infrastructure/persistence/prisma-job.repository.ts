import { Injectable } from '@nestjs/common';
import { JobStatus as PrismaJobStatus, EmploymentType as PrismaEmploymentType } from '@prisma/client';

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
    const rows = await this.prisma.job.findMany({
      where: {
        ...(criteria.publishedOnly ? { status: PrismaJobStatus.PUBLISHED } : {}),
        ...(criteria.specialization ? { specialization: criteria.specialization } : {}),
        ...(criteria.city ? { city: criteria.city } : {}),
        ...(criteria.country ? { country: criteria.country } : {}),
      },
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
      specialization: job.specialization,
      employmentType: job.employmentType as unknown as PrismaEmploymentType,
      salaryMin: job.salary?.min ?? null,
      salaryMax: job.salary?.max ?? null,
      currency: job.salary?.currency ?? 'USD',
      city: job.city ?? null,
      country: job.country ?? null,
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

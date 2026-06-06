import { Injectable } from '@nestjs/common';
import { ApplicationStatus as PrismaApplicationStatus } from '@prisma/client';

import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JobApplicationRepository } from '../../domain/repositories/job-application.repository';
import { JobApplicationMapper } from './job-application.mapper';

@Injectable()
export class PrismaJobApplicationRepository implements JobApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<JobApplication | null> {
    const row = await this.prisma.jobApplication.findUnique({
      where: { id },
    });
    return row ? JobApplicationMapper.toDomain(row) : null;
  }

  async findByJobAndDoctor(jobId: string, doctorId: string): Promise<JobApplication | null> {
    const row = await this.prisma.jobApplication.findUnique({
      where: {
        jobId_doctorId: {
          jobId,
          doctorId,
        },
      },
    });
    return row ? JobApplicationMapper.toDomain(row) : null;
  }

  async findByDoctorId(doctorId: string): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(JobApplicationMapper.toDomain);
  }

  async findByJobId(jobId: string): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(JobApplicationMapper.toDomain);
  }

  async save(application: JobApplication): Promise<void> {
    const data = {
      id: application.id,
      jobId: application.jobId,
      doctorId: application.doctorId,
      coverLetter: application.coverLetter ?? null,
      status: application.status as unknown as PrismaApplicationStatus,
    };

    await this.prisma.jobApplication.upsert({
      where: { id: application.id },
      create: data,
      update: data,
    });
  }
}

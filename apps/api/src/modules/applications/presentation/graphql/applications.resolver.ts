import { Args, ID, Mutation, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { Inject, NotFoundException } from '@nestjs/common';

import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';

import { ApplyToJobUseCase } from '../../application/use-cases/apply-to-job.use-case';
import { WithdrawApplicationUseCase } from '../../application/use-cases/withdraw-application.use-case';
import { UpdateApplicationStatusUseCase } from '../../application/use-cases/update-application-status.use-case';
import { GetDoctorApplicationsUseCase } from '../../application/use-cases/get-doctor-applications.use-case';
import { GetJobApplicationsUseCase } from '../../application/use-cases/get-job-applications.use-case';

import { JOB_REPOSITORY, JobRepository } from '../../../jobs/domain/repositories/job.repository';
import { toJobDetail } from '../../../jobs/application/read-models/job.read-model';
import { JobApplicationType } from './job-application.type';
import { ApplicationStatus } from '../../domain/value-objects/application-status.vo';

@Resolver(() => JobApplicationType)
export class ApplicationsResolver {
  constructor(
    private readonly applyToJobUseCase: ApplyToJobUseCase,
    private readonly withdrawApplicationUseCase: WithdrawApplicationUseCase,
    private readonly updateApplicationStatusUseCase: UpdateApplicationStatusUseCase,
    private readonly getDoctorApplicationsUseCase: GetDoctorApplicationsUseCase,
    private readonly getJobApplicationsUseCase: GetJobApplicationsUseCase,
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [JobApplicationType], { name: 'myApplications' })
  @Roles('DOCTOR')
  async myApplications(@CurrentUser() user: { id: string }) {
    const apps = await this.getDoctorApplicationsUseCase.execute(user.id);
    const jobIds = [...new Set(apps.map(a => a.jobId))];
    const jobs = await Promise.all(jobIds.map(id => this.jobRepository.findById(id)));
    const jobsMap = new Map(jobs.filter((j): j is any => !!j).map(j => [j.id, toJobDetail(j)]));

    const doctor = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { doctorProfile: true },
    });

    return apps.map(app => ({
      id: app.id,
      jobId: app.jobId,
      doctorId: app.doctorId,
      coverLetter: app.coverLetter,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job: jobsMap.get(app.jobId),
      doctor,
    }));
  }

  @Query(() => [JobApplicationType], { name: 'jobApplications' })
  @Roles('EMPLOYER')
  async jobApplications(
    @CurrentUser() user: { id: string },
    @Args('jobId', { type: () => ID }) jobId: string,
  ) {
    const apps = await this.getJobApplicationsUseCase.execute({ jobId, employerId: user.id });
    const jobDomain = await this.jobRepository.findById(jobId);
    const job = jobDomain ? toJobDetail(jobDomain) : undefined;

    const doctorIds = [...new Set(apps.map(a => a.doctorId))];
    const doctors = await this.prisma.user.findMany({
      where: { id: { in: doctorIds } },
      include: { doctorProfile: true },
    });
    const doctorsMap = new Map(doctors.map(d => [d.id, d]));

    return apps.map(app => ({
      id: app.id,
      jobId: app.jobId,
      doctorId: app.doctorId,
      coverLetter: app.coverLetter,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job,
      doctor: doctorsMap.get(app.doctorId),
    }));
  }

  @Mutation(() => ID, { name: 'applyToJob' })
  @Roles('DOCTOR')
  async applyToJob(
    @CurrentUser() user: { id: string },
    @Args('jobId', { type: () => ID }) jobId: string,
    @Args('coverLetter', { type: () => String, nullable: true }) coverLetter?: string,
  ) {
    const { id } = await this.applyToJobUseCase.execute({
      jobId,
      doctorId: user.id,
      coverLetter,
    });
    return id;
  }

  @Mutation(() => ID, { name: 'withdrawApplication' })
  @Roles('DOCTOR')
  async withdrawApplication(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
  ) {
    await this.withdrawApplicationUseCase.execute({ id, doctorId: user.id });
    return id;
  }

  @Mutation(() => ID, { name: 'updateApplicationStatus' })
  @Roles('EMPLOYER')
  async updateApplicationStatus(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => ApplicationStatus }) status: ApplicationStatus,
  ) {
    await this.updateApplicationStatusUseCase.execute({
      id,
      employerId: user.id,
      status,
    });
    return id;
  }

  @ResolveField()
  async job(@Parent() application: any) {
    if (application.job) return application.job;
    const job = await this.jobRepository.findById(application.jobId);
    if (!job) throw new NotFoundException('Job not found');
    return toJobDetail(job);
  }

  @ResolveField()
  async doctor(@Parent() application: any) {
    if (application.doctor) return application.doctor;
    const user = await this.prisma.user.findUnique({
      where: { id: application.doctorId },
      include: { doctorProfile: true },
    });
    if (!user) throw new NotFoundException('Doctor not found');
    return user;
  }
}

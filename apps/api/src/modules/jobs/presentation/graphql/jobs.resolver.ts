import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { GetJobDetailUseCase } from '../../application/use-cases/get-job-detail.use-case';
import { SearchJobsUseCase } from '../../application/use-cases/search-jobs.use-case';
import { JOB_REPOSITORY, JobRepository } from '../../domain/repositories/job.repository';
import { toJobDetail } from '../../application/read-models/job.read-model';
import { CreateJobInputType } from './create-job.input';
import { JobDetailType, JobType } from './job.type';
import { JobFilterInput } from './job-filter.input';

@Resolver(() => JobType)
export class JobsResolver {
  constructor(
    private readonly searchJobs: SearchJobsUseCase,
    private readonly getJobDetail: GetJobDetailUseCase,
    private readonly createJobUseCase: CreateJobUseCase,
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepository,
  ) {}

  // Public browsing — the global SupabaseAuthGuard blocks everything not
  // marked @Public.
  @Public()
  @Query(() => [JobType], { name: 'jobs' })
  jobs(
    @Args('filter', { type: () => JobFilterInput, nullable: true })
    filter?: JobFilterInput,
  ): Promise<JobType[]> {
    return this.searchJobs.execute(filter ?? {});
  }

  @Public()
  @Query(() => JobDetailType, { name: 'job' })
  job(@Args('id', { type: () => ID }) id: string): Promise<JobDetailType> {
    return this.getJobDetail.execute(id);
  }

  @Query(() => [JobDetailType], { name: 'myJobs' })
  @Roles('EMPLOYER')
  async myJobs(@CurrentUser() user: { id: string }): Promise<JobDetailType[]> {
    const list = await this.jobRepository.search({ employerId: user.id, publishedOnly: false });
    return list.map(toJobDetail);
  }

  @Mutation(() => ID, { name: 'createJob' })
  @Roles('EMPLOYER')
  async createJob(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateJobInputType,
  ): Promise<string> {
    const { id } = await this.createJobUseCase.execute({
      ...input,
      employerId: user.id,
    });
    return id;
  }

  @Mutation(() => ID, { name: 'publishJob' })
  @Roles('EMPLOYER')
  async publishJob(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== user.id) {
      throw new UnauthorizedException('You are not authorized to publish this job');
    }
    job.publish();
    await this.jobRepository.save(job);
    return job.id;
  }

  @Mutation(() => ID, { name: 'closeJob' })
  @Roles('EMPLOYER')
  async closeJob(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
  ): Promise<string> {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== user.id) {
      throw new UnauthorizedException('You are not authorized to close this job');
    }
    job.close();
    await this.jobRepository.save(job);
    return job.id;
  }
}


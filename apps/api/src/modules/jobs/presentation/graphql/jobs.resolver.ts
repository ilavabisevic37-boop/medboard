import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { CreateJobUseCase } from '../../application/use-cases/create-job.use-case';
import { GetJobDetailUseCase } from '../../application/use-cases/get-job-detail.use-case';
import { SearchJobsUseCase } from '../../application/use-cases/search-jobs.use-case';
import { CreateJobInputType } from './create-job.input';
import { JobDetailType, JobType } from './job.type';
import { JobFilterInput } from './job-filter.input';

@Resolver(() => JobType)
export class JobsResolver {
  constructor(
    private readonly searchJobs: SearchJobsUseCase,
    private readonly getJobDetail: GetJobDetailUseCase,
    private readonly createJobUseCase: CreateJobUseCase,
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

  // TODO(auth): guard this mutation for EMPLOYER role and source employerId
  // from the auth context once the auth module is integrated.
  @Mutation(() => ID, { name: 'createJob' })
  async createJob(@Args('input') input: CreateJobInputType): Promise<string> {
    const { id } = await this.createJobUseCase.execute(input);
    return id;
  }
}

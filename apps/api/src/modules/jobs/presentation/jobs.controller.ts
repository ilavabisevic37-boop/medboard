import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { SearchJobsUseCase } from '../application/use-cases/search-jobs.use-case';
import { CreateJobHttpDto } from './dtos/create-job.http.dto';
import { Public } from '../../auth/presentation/decorators/public.decorator';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly createJob: CreateJobUseCase,
    private readonly searchJobs: SearchJobsUseCase,
  ) {}

  @Public()
  @Get()
  async list(
    @Query('specialization') specialization?: string,
    @Query('city') city?: string,
    @Query('country') country?: string,
  ) {
    return this.searchJobs.execute({ specialization, city, country });
  }

  @Post()
  async create(@Body() body: CreateJobHttpDto) {
    return this.createJob.execute(body);
  }
}

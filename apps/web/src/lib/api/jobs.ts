import { gql } from 'graphql-request';

import { JobDetail, JobFilter, JobSummary } from '@medboard/shared-types';

import { gqlClient } from '../graphql/client';

const JOBS_QUERY = gql`
  query Jobs($filter: JobFilterInput) {
    jobs(filter: $filter) {
      id
      title
      summary
      specialization
      employmentType
      shift
      city
      country
      remote
      urgent
      salaryMin
      salaryMax
      salaryPeriod
      currency
      publishedAt
    }
  }
`;

const JOB_QUERY = gql`
  query Job($id: ID!) {
    job(id: $id) {
      id
      title
      summary
      description
      specialization
      employmentType
      shift
      experience
      city
      country
      remote
      urgent
      salaryMin
      salaryMax
      salaryPeriod
      currency
      requirements
      benefits
      employerId
      status
      publishedAt
      createdAt
    }
  }
`;

export async function fetchJobs(filter: JobFilter = {}): Promise<JobSummary[]> {
  try {
    const data = await gqlClient.request<{ jobs: JobSummary[] }>(JOBS_QUERY, { filter });
    return data.jobs;
  } catch (err) {
    console.error('FETCH JOBS ERROR:', err);
    return [];
  }
}

export async function fetchJob(id: string): Promise<JobDetail | null> {
  try {
    const data = await gqlClient.request<{ job: JobDetail }>(JOB_QUERY, { id });
    return data.job;
  } catch {
    return null;
  }
}

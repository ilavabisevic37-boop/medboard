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

const CREATE_JOB_MUTATION = gql`
  mutation CreateJob($input: CreateJobInputType!) {
    createJob(input: $input)
  }
`;

const PUBLISH_JOB_MUTATION = gql`
  mutation PublishJob($id: ID!) {
    publishJob(id: $id)
  }
`;

const CLOSE_JOB_MUTATION = gql`
  mutation CloseJob($id: ID!) {
    closeJob(id: $id)
  }
`;

const MY_JOBS_QUERY = gql`
  query MyJobs {
    myJobs {
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
      createdAt
    }
  }
`;

export async function createJob(input: any): Promise<string> {
  const data = await gqlClient.request<{ createJob: string }>(CREATE_JOB_MUTATION, {
    input,
  });
  return data.createJob;
}

export async function publishJob(id: string): Promise<string> {
  const data = await gqlClient.request<{ publishJob: string }>(PUBLISH_JOB_MUTATION, { id });
  return data.publishJob;
}

export async function closeJob(id: string): Promise<string> {
  const data = await gqlClient.request<{ closeJob: string }>(CLOSE_JOB_MUTATION, { id });
  return data.closeJob;
}

export async function fetchMyJobs(): Promise<JobDetail[]> {
  const data = await gqlClient.request<{ myJobs: JobDetail[] }>(MY_JOBS_QUERY);
  return data.myJobs;
}


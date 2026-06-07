import { gql } from 'graphql-request';
import { gqlClient } from '../graphql/client';

const APPLY_TO_JOB_MUTATION = gql`
  mutation ApplyToJob($jobId: ID!, $coverLetter: String) {
    applyToJob(jobId: $jobId, coverLetter: $coverLetter)
  }
`;

const WITHDRAW_APPLICATION_MUTATION = gql`
  mutation WithdrawApplication($id: ID!) {
    withdrawApplication(id: $id)
  }
`;

const UPDATE_APPLICATION_STATUS_MUTATION = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status)
  }
`;

const MY_APPLICATIONS_QUERY = gql`
  query MyApplications {
    myApplications {
      id
      jobId
      status
      createdAt
      job {
        id
        title
        city
        country
        salaryMin
        salaryMax
        salaryPeriod
        currency
        employerId
      }
    }
  }
`;

const MY_APPLICATION_STATUS_QUERY = gql`
  query MyApplications {
    myApplications {
      id
      jobId
      status
    }
  }
`;

const JOB_APPLICATIONS_QUERY = gql`
  query JobApplications($jobId: ID!) {
    jobApplications(jobId: $jobId) {
      id
      jobId
      doctorId
      coverLetter
      status
      createdAt
      doctor {
        id
        email
        firstName
        lastName
        doctorProfile {
          specialization
          yearsOfExp
          bio
          city
          country
        }
      }
    }
  }
`;

export async function applyToJob(jobId: string, coverLetter?: string): Promise<string> {
  const data = await gqlClient.request<{ applyToJob: string }>(APPLY_TO_JOB_MUTATION, {
    jobId,
    coverLetter,
  });
  return data.applyToJob;
}

export async function withdrawApplication(id: string): Promise<string> {
  const data = await gqlClient.request<{ withdrawApplication: string }>(
    WITHDRAW_APPLICATION_MUTATION,
    { id },
  );
  return data.withdrawApplication;
}

export async function updateApplicationStatus(id: string, status: string): Promise<string> {
  const data = await gqlClient.request<{ updateApplicationStatus: string }>(
    UPDATE_APPLICATION_STATUS_MUTATION,
    { id, status },
  );
  return data.updateApplicationStatus;
}

export async function fetchMyApplications(): Promise<any[]> {
  const data = await gqlClient.request<{ myApplications: any[] }>(MY_APPLICATIONS_QUERY);
  return data.myApplications;
}

export async function fetchJobApplications(jobId: string): Promise<any[]> {
  const data = await gqlClient.request<{ jobApplications: any[] }>(JOB_APPLICATIONS_QUERY, {
    jobId,
  });
  return data.jobApplications;
}

export async function checkMyApplicationStatus(jobId: string): Promise<{ hasApplied: boolean; applicationId?: string; status?: string }> {
  try {
    const data = await gqlClient.request<{ myApplications: { id: string; jobId: string; status: string }[] }>(MY_APPLICATION_STATUS_QUERY);
    const match = data.myApplications.find((a) => a.jobId === jobId && a.status !== 'WITHDRAWN');
    return match
      ? { hasApplied: true, applicationId: match.id, status: match.status }
      : { hasApplied: false };
  } catch {
    return { hasApplied: false };
  }
}

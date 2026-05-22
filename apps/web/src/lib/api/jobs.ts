import { JobSummary } from '@medboard/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function fetchJobs(params: Record<string, string> = {}): Promise<JobSummary[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/jobs${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

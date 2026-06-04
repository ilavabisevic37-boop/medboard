import { fetchJobs } from '../../lib/api/jobs';
import JobsClientPage from './JobsClientPage';

export default async function JobsPage() {
  const jobs = await fetchJobs();
  return <JobsClientPage jobs={jobs} />;
}

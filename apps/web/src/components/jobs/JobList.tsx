import { Stack, Typography } from '@mui/material';

import { JobSummary } from '@medboard/shared-types';

import { JobCard } from './JobCard';

interface Props {
  jobs: JobSummary[];
}

export function JobList({ jobs }: Props) {
  if (jobs.length === 0) {
    return <Typography color="text.secondary">Не знайдено вакансій за цими фільтрами.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </Stack>
  );
}

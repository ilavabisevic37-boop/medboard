'use client';

import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import { JobSummary } from '@medboard/shared-types';

interface Props {
  jobs: JobSummary[];
}

export function JobList({ jobs }: Props) {
  if (jobs.length === 0) {
    return <Typography color="text.secondary">Поки що немає опублікованих вакансій.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {jobs.map((job) => (
        <Card key={job.id} variant="outlined">
          <CardContent>
            <Typography variant="h6">{job.title}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label={job.specialization} size="small" color="primary" variant="outlined" />
              <Chip label={job.employmentType} size="small" />
              {job.city && <Chip label={job.city} size="small" variant="outlined" />}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

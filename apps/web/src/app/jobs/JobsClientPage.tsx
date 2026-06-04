'use client';

import { Container, Typography } from '@mui/material';
import { JobList } from '../../components/jobs/JobList';
import { JobSummary } from '@medboard/shared-types';

export default function JobsClientPage({ jobs }: { jobs: JobSummary[] }) {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Відкриті вакансії
      </Typography>
      <JobList jobs={jobs} />
    </Container>
  );
}

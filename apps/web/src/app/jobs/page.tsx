import { Container, Typography } from '@mui/material';

import { JobList } from '../../components/jobs/JobList';
import { fetchJobs } from '../../lib/api/jobs';

export default async function JobsPage() {
  const jobs = await fetchJobs();
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Відкриті вакансії
      </Typography>
      <JobList jobs={jobs} />
    </Container>
  );
}

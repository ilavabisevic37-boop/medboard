import { Box, Container, Stack, Typography } from '@mui/material';

import { JobFilter } from '@medboard/shared-types';

import { JobFilters } from '../../components/jobs/JobFilters';
import { JobList } from '../../components/jobs/JobList';
import { fetchJobs } from '../../lib/api/jobs';
import { AppHeader } from '../../components/layout/AppHeader';

type SearchParams = Record<string, string | string[] | undefined>;

function buildFilter(sp: SearchParams): JobFilter {
  const one = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : undefined);
  return {
    query: one('query'),
    specialization: one('specialization'),
    employmentType: one('employmentType') as JobFilter['employmentType'],
    shift: one('shift') as JobFilter['shift'],
    remote: sp.remote === 'true' ? true : undefined,
    urgent: sp.urgent === 'true' ? true : undefined,
  };
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const filter = buildFilter(searchParams);
  const jobs = await fetchJobs(filter);

  return (
    <>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Відкриті вакансії
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          <JobFilters />
          <Box sx={{ flex: 1, width: '100%' }}>
            <JobList jobs={jobs} />
          </Box>
        </Stack>
      </Container>
    </>
  );
}

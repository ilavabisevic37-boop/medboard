import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';

import { JobSummary } from '@medboard/shared-types';

import { employmentLabel, formatSalary, shiftLabel } from '../../lib/format';

interface Props {
  job: JobSummary;
}

export function JobCard({ job }: Props) {
  const salary = formatSalary(job);
  const shift = shiftLabel(job.shift);

  return (
    <Card variant="outlined">
      <CardActionArea component={Link} href={`/jobs/${job.id}`}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {job.title}
            </Typography>
            {job.urgent && <Chip label="Urgent" size="small" color="error" />}
          </Stack>

          {job.summary && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
              {job.summary}
            </Typography>
          )}

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
            <Chip label={job.specialization} size="small" color="primary" variant="outlined" />
            <Chip label={employmentLabel(job.employmentType)} size="small" />
            {shift && <Chip label={shift} size="small" variant="outlined" />}
            {(job.city || job.country) && (
              <Chip label={[job.city, job.country].filter(Boolean).join(', ')} size="small" variant="outlined" />
            )}
            {job.remote && <Chip label="Remote" size="small" color="success" variant="outlined" />}
          </Stack>

          {salary && (
            <Box sx={{ mt: 1.5 }}>
              <Typography component="span" fontWeight={700}>
                {salary}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

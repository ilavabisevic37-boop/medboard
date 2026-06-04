import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { fetchJob } from '../../../lib/api/jobs';
import { employmentLabel, formatSalary, shiftLabel } from '../../../lib/format';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await fetchJob(params.id);
  if (!job) notFound();

  const salary = formatSalary(job);
  const shift = shiftLabel(job.shift);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={Link} href="/jobs" sx={{ mb: 2 }}>
        ← До вакансій
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {job.title}
        </Typography>
        {job.urgent && <Chip label="Urgent" color="error" />}
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
        <Chip label={job.specialization} color="primary" variant="outlined" />
        <Chip label={employmentLabel(job.employmentType)} />
        {shift && <Chip label={shift} variant="outlined" />}
        {(job.city || job.country) && (
          <Chip label={[job.city, job.country].filter(Boolean).join(', ')} variant="outlined" />
        )}
        {job.remote && <Chip label="Remote" color="success" variant="outlined" />}
      </Stack>

      {salary && (
        <Typography variant="h6" sx={{ mt: 2 }} fontWeight={700}>
          {salary}
        </Typography>
      )}

      {job.summary && (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {job.summary}
        </Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Опис
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-line' }}>{job.description}</Typography>

      {job.requirements.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Вимоги
          </Typography>
          <List dense disablePadding>
            {job.requirements.map((r) => (
              <ListItem key={r} sx={{ pl: 0 }}>
                <ListItemText primary={`• ${r}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {job.benefits.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Що пропонуємо
          </Typography>
          <List dense disablePadding>
            {job.benefits.map((b) => (
              <ListItem key={b} sx={{ pl: 0 }}>
                <ListItemText primary={`• ${b}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Paper variant="outlined" sx={{ mt: 4, p: 3 }}>
        {/* TODO(auth): enable Apply once auth + applications vertical lands. */}
        <Button variant="contained" size="large" disabled fullWidth>
          Відгукнутися (потрібен вхід)
        </Button>
      </Paper>
    </Container>
  );
}

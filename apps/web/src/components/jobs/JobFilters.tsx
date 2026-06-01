'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// TODO: source these from the API (distinct specializations) instead of hardcoding.
const SPECIALTIES = [
  'Registered Nurse',
  'Emergency Medicine',
  'Anesthesiology',
  'Pediatrics',
  'Family Medicine',
  'Cardiology',
  'Surgical Tech',
  'ICU / Critical Care',
  'Physical Therapy',
  'Psychiatry',
];

const EMPLOYMENT_TYPES = [
  ['FULL_TIME', 'Full-time'],
  ['PART_TIME', 'Part-time'],
  ['CONTRACT', 'Contract'],
  ['LOCUM', 'Locum'],
  ['INTERNSHIP', 'Internship'],
] as const;

const SHIFTS = [
  ['DAY', 'Day'],
  ['NIGHT', 'Night'],
  ['ROTATING', 'Rotating'],
  ['WEEKEND', 'Weekend'],
] as const;

export function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string | boolean) => {
    const next = new URLSearchParams(params.toString());
    if (value === '' || value === false) next.delete(key);
    else next.set(key, String(value));
    router.push(`/jobs?${next.toString()}`);
  };

  return (
    <Box component="aside" sx={{ minWidth: 240 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Фільтри
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Пошук"
          size="small"
          defaultValue={params.get('query') ?? ''}
          onBlur={(e) => setParam('query', e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Спеціальність"
          size="small"
          value={params.get('specialization') ?? ''}
          onChange={(e) => setParam('specialization', e.target.value)}
          fullWidth
        >
          <MenuItem value="">Усі</MenuItem>
          {SPECIALTIES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Тип зайнятості"
          size="small"
          value={params.get('employmentType') ?? ''}
          onChange={(e) => setParam('employmentType', e.target.value)}
          fullWidth
        >
          <MenuItem value="">Усі</MenuItem>
          {EMPLOYMENT_TYPES.map(([v, l]) => (
            <MenuItem key={v} value={v}>
              {l}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Зміна"
          size="small"
          value={params.get('shift') ?? ''}
          onChange={(e) => setParam('shift', e.target.value)}
          fullWidth
        >
          <MenuItem value="">Будь-яка</MenuItem>
          {SHIFTS.map(([v, l]) => (
            <MenuItem key={v} value={v}>
              {l}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={params.get('remote') === 'true'}
              onChange={(e) => setParam('remote', e.target.checked)}
            />
          }
          label="Тільки віддалені"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={params.get('urgent') === 'true'}
              onChange={(e) => setParam('urgent', e.target.checked)}
            />
          }
          label="Терміново"
        />
        <Button variant="text" onClick={() => router.push('/jobs')}>
          Скинути
        </Button>
      </Stack>
    </Box>
  );
}

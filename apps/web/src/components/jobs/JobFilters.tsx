'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const SPECIALTIES = [
  'Registered Nurse',
  'Emergency Medicine',
  'Anesthesiology',
  'Pediatrics',
  'Family Medicine',
  'Surgical Tech',
  'ICU / Critical Care',
  'Physical Therapy',
  'Psychiatry',
  'Cardiology',
];

const EMPLOYMENT_TYPES: [string, string][] = [
  ['FULL_TIME', 'Full-time'],
  ['PART_TIME', 'Part-time'],
  ['CONTRACT', 'Contract'],
  ['LOCUM', 'Locum'],
  ['INTERNSHIP', 'Internship'],
];

const SHIFTS: [string, string][] = [
  ['DAY', 'Day'],
  ['NIGHT', 'Night'],
  ['ROTATING', 'Rotating'],
  ['WEEKEND', 'Weekend'],
];

interface CheckGroupProps {
  title: string;
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}

function CheckGroup({ title, options, selected, onSelect }: CheckGroupProps) {
  return (
    <Box sx={{ py: 2, px: 2.25, borderBottom: '1px solid', borderColor: '#EDF2F9' }}>
      <Typography
        sx={{
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#8896A6',
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {options.map((o) => {
          const on = selected === o.value;
          return (
            <Box
              key={o.value}
              onClick={() => onSelect(o.value)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                cursor: 'pointer',
                px: 1,
                py: 0.9,
                borderRadius: '8px',
                fontSize: '0.9063rem',
                color: on ? 'text.primary' : 'text.secondary',
                fontWeight: on ? 600 : 400,
                transition: 'background 0.12s',
                '&:hover': { bgcolor: '#F6F8FB' },
              }}
            >
              <Box
                sx={{
                  width: 19,
                  height: 19,
                  borderRadius: '6px',
                  border: '1.6px solid',
                  borderColor: on ? '#2B4C7E' : '#E2E8F0',
                  bgcolor: on ? '#2B4C7E' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.12s',
                  flexShrink: 0,
                }}
              >
                {on && <CheckRoundedIcon sx={{ fontSize: 13 }} />}
              </Box>
              <span>{o.label}</span>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string | boolean) => {
    const next = new URLSearchParams(params.toString());
    if (value === '' || value === false) next.delete(key);
    else next.set(key, String(value));
    router.push(`/jobs?${next.toString()}`);
  };

  const toggleParam = (key: string, value: string) => {
    const current = params.get(key);
    if (current === value) {
      setParam(key, '');
    } else {
      setParam(key, value);
    }
  };

  const activeCount =
    (params.get('specialization') ? 1 : 0) +
    (params.get('employmentType') ? 1 : 0) +
    (params.get('shift') ? 1 : 0) +
    (params.get('remote') === 'true' ? 1 : 0) +
    (params.get('urgent') === 'true' ? 1 : 0);

  return (
    <Box
      component="aside"
      sx={{
        width: 276,
        flexShrink: 0,
        position: 'sticky',
        top: 86,
        alignSelf: 'start',
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '18px',
          boxShadow: '0 1px 2px rgba(30,50,80,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.25,
            pt: 2,
            pb: 0.5,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Typography
              component="button"
              onClick={() => router.push('/jobs')}
              sx={{
                border: 0,
                bgcolor: 'transparent',
                color: '#2B4C7E',
                fontFamily: 'inherit',
                fontWeight: 650,
                fontSize: '0.8438rem',
                cursor: 'pointer',
                p: 0,
              }}
            >
              Clear ({activeCount})
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 2.25, borderBottom: '1px solid', borderColor: '#EDF2F9' }}>
          <TextField
            label="Пошук"
            size="small"
            key={params.get('query') ?? ''}
            defaultValue={params.get('query') ?? ''}
            onBlur={(e) => setParam('query', e.target.value)}
            fullWidth
            InputProps={{
              sx: { borderRadius: '12px' }
            }}
          />
        </Box>

        <CheckGroup
          title="Specialty"
          options={SPECIALTIES.map((s) => ({ value: s, label: s }))}
          selected={params.get('specialization')}
          onSelect={(v) => toggleParam('specialization', v)}
        />

        <CheckGroup
          title="Job type"
          options={EMPLOYMENT_TYPES.map(([v, l]) => ({ value: v, label: l }))}
          selected={params.get('employmentType')}
          onSelect={(v) => toggleParam('employmentType', v)}
        />

        <CheckGroup
          title="Shift"
          options={SHIFTS.map(([v, l]) => ({ value: v, label: l }))}
          selected={params.get('shift')}
          onSelect={(v) => toggleParam('shift', v)}
        />

        {/* Remote & Urgent */}
        <Box sx={{ py: 2, px: 2.25 }}>
          <Box
            onClick={() => setParam('remote', params.get('remote') !== 'true')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              px: 1,
              py: 0.9,
              borderRadius: '8px',
              fontSize: '0.9063rem',
              color: params.get('remote') === 'true' ? 'text.primary' : 'text.secondary',
              fontWeight: params.get('remote') === 'true' ? 600 : 400,
              '&:hover': { bgcolor: '#F6F8FB' },
            }}
          >
            <Box
              sx={{
                width: 19,
                height: 19,
                borderRadius: '6px',
                border: '1.6px solid',
                borderColor: params.get('remote') === 'true' ? '#2B4C7E' : '#E2E8F0',
                bgcolor: params.get('remote') === 'true' ? '#2B4C7E' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.12s',
                flexShrink: 0,
              }}
            >
              {params.get('remote') === 'true' && <CheckRoundedIcon sx={{ fontSize: 13 }} />}
            </Box>
            Remote only
          </Box>
          <Box
            onClick={() => setParam('urgent', params.get('urgent') !== 'true')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              px: 1,
              py: 0.9,
              borderRadius: '8px',
              fontSize: '0.9063rem',
              color: params.get('urgent') === 'true' ? 'text.primary' : 'text.secondary',
              fontWeight: params.get('urgent') === 'true' ? 600 : 400,
              '&:hover': { bgcolor: '#F6F8FB' },
            }}
          >
            <Box
              sx={{
                width: 19,
                height: 19,
                borderRadius: '6px',
                border: '1.6px solid',
                borderColor: params.get('urgent') === 'true' ? '#2B4C7E' : '#E2E8F0',
                bgcolor: params.get('urgent') === 'true' ? '#2B4C7E' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.12s',
                flexShrink: 0,
              }}
            >
              {params.get('urgent') === 'true' && <CheckRoundedIcon sx={{ fontSize: 13 }} />}
            </Box>
            Urgent only
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

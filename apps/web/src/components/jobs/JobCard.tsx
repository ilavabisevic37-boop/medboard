import Link from 'next/link';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BoltIcon from '@mui/icons-material/Bolt';

import { JobSummary } from '@medboard/shared-types';

import { employmentLabel, formatSalary, shiftLabel } from '../../lib/format';

interface Props {
  job: JobSummary;
}

export function JobCard({ job }: Props) {
  const salary = formatSalary(job);
  const shift = shiftLabel(job.shift);

  // Fallback letter for the monogram
  const avatarLetter = job.title.charAt(0).toUpperCase();

  return (
    <Card
      variant="outlined"
      sx={{
        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        borderRadius: 4,
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(30,50,80,0.08), 0 2px 8px rgba(30,50,80,0.04)',
          borderColor: 'primary.light',
        }
      }}
    >
      <CardActionArea component={Link} href={`/jobs/${job.id}`} sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack direction="row" spacing={2.5} alignItems="flex-start">
            <Avatar
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                bgcolor: '#EDF2F9', // brand-50 from design
                color: 'primary.main',
                fontWeight: 800,
                fontSize: '1.25rem',
                borderRadius: 3
              }}
            >
              {avatarLetter}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.5, letterSpacing: '-0.01em' }}>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Медичний заклад (Клініка)
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                {(job.city || job.country) && (
                  <Chip
                    icon={<LocationOnOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                    label={[job.city, job.country].filter(Boolean).join(', ')}
                    size="small"
                    variant="outlined"
                    sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', fontWeight: 650, color: 'text.secondary' }}
                  />
                )}
                <Chip
                  icon={<WorkOutlineOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                  label={employmentLabel(job.employmentType)}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', fontWeight: 650, color: 'text.secondary' }}
                />
                {shift && (
                  <Chip
                    icon={<AccessTimeOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                    label={shift}
                    size="small"
                    variant="outlined"
                    sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', fontWeight: 650, color: 'text.secondary' }}
                  />
                )}
                {job.remote && (
                  <Chip
                    label="Remote"
                    size="small"
                    sx={{ bgcolor: '#EDF2F9', color: 'primary.dark', fontWeight: 750, border: 'none' }}
                  />
                )}
                {job.urgent && (
                  <Chip
                    icon={<BoltIcon sx={{ fontSize: '16px !important', color: '#8E2814' }} />}
                    label="Urgent"
                    size="small"
                    sx={{
                      bgcolor: '#FBE9E7',
                      color: '#C45C3A',
                      fontWeight: 750,
                      border: 'none',
                      '& .MuiChip-icon': { color: '#C45C3A' }
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <Box sx={{
            mt: 3,
            pt: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              {salary ? (
                <Typography component="span" fontWeight={800} fontSize="1.125rem" color="primary.main" sx={{ letterSpacing: '-0.02em' }}>
                  {salary} <Typography component="span" fontSize="0.875rem" color="text.secondary" fontWeight={650}>/ {job.salaryPeriod === 'YEAR' ? 'рік' : job.salaryPeriod === 'WEEK' ? 'тиждень' : 'год'}</Typography>
                </Typography>
              ) : (
                <Typography component="span" fontWeight={650} color="text.secondary" fontSize="0.9375rem">
                  Зарплата за домовленістю
                </Typography>
              )}
            </Box>

            <Chip
              label={job.specialization}
              size="small"
              sx={{
                bgcolor: '#EDF2F9',
                color: 'primary.dark',
                fontWeight: 700,
                border: 'none',
                px: 1
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

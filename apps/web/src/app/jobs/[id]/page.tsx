import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import { fetchJob } from '../../../lib/api/jobs';
import { employmentLabel, formatSalary, shiftLabel } from '../../../lib/format';

function Fact({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ width: 44, height: 44, bgcolor: 'background.paper', color: 'text.secondary', border: '1px solid', borderColor: 'divider', boxShadow: '0 1px 2px rgba(30,50,80,0.04)' }}>
        {icon}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.2, mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={800} color={accent ? 'primary.main' : 'text.primary'} sx={{ letterSpacing: '-0.01em' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await fetchJob(params.id);
  if (!job) notFound();

  const salary = formatSalary(job);
  const shift = shiftLabel(job.shift);
  const avatarLetter = job.title.charAt(0).toUpperCase();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button 
        component={Link} 
        href="/jobs" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4, fontWeight: 700, color: 'text.secondary', '&:hover': { bgcolor: 'background.paper', color: 'text.primary' } }}
      >
        До вакансій
      </Button>

      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Avatar 
                variant="rounded" 
                sx={{ 
                  width: { xs: 72, md: 84 }, 
                  height: { xs: 72, md: 84 }, 
                  bgcolor: '#EDF2F9', 
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  borderRadius: 4
                }}
              >
                {avatarLetter}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Typography variant="h3" component="h1" fontWeight={800} sx={{ letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                    {job.title}
                  </Typography>
                  {job.urgent && (
                    <Chip 
                      icon={<BoltIcon sx={{ color: '#8E2814 !important' }} />} 
                      label="Терміново" 
                      size="small"
                      sx={{ bgcolor: '#FBE9E7', color: '#C45C3A', fontWeight: 750, '& .MuiChip-icon': { color: '#C45C3A' } }} 
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="subtitle1" fontWeight={750} color="text.primary">Медичний заклад (Клініка)</Typography>
                  <VerifiedUserIcon color="primary" sx={{ fontSize: 18 }} />
                  <Typography color="text.secondary" sx={{ mx: 0.5 }}>·</Typography>
                  <Typography color="text.secondary" fontWeight={600}>{job.city}</Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Facts Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 3, sm: 4 }, mb: 6 }}>
            <Fact icon={<AttachMoneyOutlinedIcon />} label="Зарплата" value={salary ? `${salary} / ${job.salaryPeriod === 'YEAR' ? 'рік' : job.salaryPeriod === 'MONTH' ? 'міс' : 'год'}` : 'За домовленістю'} accent />
            <Fact icon={<WorkOutlineOutlinedIcon />} label="Зайнятість" value={employmentLabel(job.employmentType)} />
            {shift && <Fact icon={<AccessTimeOutlinedIcon />} label="Графік" value={shift} />}
            {job.city && <Fact icon={<LocationOnOutlinedIcon />} label="Локація" value={job.city} />}
            {job.experience && <Fact icon={<WorkspacePremiumOutlinedIcon />} label="Досвід" value={job.experience} />}
            <Fact icon={<AutoAwesomeOutlinedIcon />} label="Спеціалізація" value={job.specialization} />
          </Box>

          {/* Content Sections */}
          <Stack spacing={5}>
            {job.summary && (
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.01em', mb: 2 }}>Про вакансію</Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: '1.05rem' }}>{job.summary}</Typography>
                {job.description && (
                  <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, mt: 2, whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{job.description}</Typography>
                )}
              </Box>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.01em', mb: 2 }}>Вимоги</Typography>
                <List disablePadding>
                  {job.requirements.map((r, i) => (
                    <ListItem key={i} sx={{ px: 0, py: 0.75, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}><CheckCircleIcon sx={{ color: '#2E8B57', fontSize: 22 }} /></ListItemIcon>
                      <ListItemText primary={r} primaryTypographyProps={{ color: 'text.primary', fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.5 }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.01em', mb: 2.5 }}>Що ми пропонуємо</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {job.benefits.map((b, i) => (
                    <Chip 
                      key={i}
                      icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: '18px !important', color: 'primary.main' }} />} 
                      label={b} 
                      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', fontWeight: 650, color: 'text.primary', p: 1.5, borderRadius: 3, fontSize: '0.95rem' }} 
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>

        {/* Sidebar Apply Card */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Card variant="outlined" sx={{ borderRadius: 5, boxShadow: '0 4px 12px rgba(30,50,80,0.04)' }}>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography color="text.secondary" fontWeight={650} fontSize="0.95rem" gutterBottom>Оплата</Typography>
                <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ letterSpacing: '-0.03em', mb: 0.5 }}>
                  {salary || 'За домовленістю'}
                </Typography>
                {salary && (
                   <Typography color="text.secondary" variant="body2" fontWeight={600} sx={{ mb: 3 }}>
                     {job.salaryPeriod === 'YEAR' ? 'на рік' : job.salaryPeriod === 'MONTH' ? 'на місяць' : 'на годину'}
                   </Typography>
                )}

                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    sx={{ 
                      py: 1.8, 
                      fontSize: '1.05rem', 
                      borderRadius: 999,
                      boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 12px rgba(43,76,126,0.2)'
                    }}
                  >
                    Відгукнутися (Потрібен вхід)
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    fullWidth 
                    startIcon={<BookmarkBorderIcon />}
                    sx={{ py: 1.5, borderRadius: 999, color: 'text.primary', borderColor: 'divider', fontWeight: 650 }}
                  >
                    Зберегти вакансію
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Опубліковано нещодавно
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

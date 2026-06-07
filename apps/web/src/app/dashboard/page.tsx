'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Paper,
  Avatar,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { AppHeader } from '../../components/layout/AppHeader';
import { fetchMyJobs, publishJob, closeJob } from '../../lib/api/jobs';
import { fetchJobApplications, updateApplicationStatus } from '../../lib/api/applications';
import { formatSalary, getJobStatusStyle, getAppStatusStyle } from '../../lib/format';
import { RoleGuard } from '../../components/auth/RoleGuard';

function EmployerDashboardContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load jobs
  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await fetchMyJobs();
      setJobs(data);
      // Auto-select first job if present and none selected
      if (data.length > 0 && !selectedJobId) {
        setSelectedJobId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load my jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Load applications when selected job changes
  useEffect(() => {
    if (!selectedJobId) return;

    const loadApps = async () => {
      try {
        setLoadingApps(true);
        const data = await fetchJobApplications(selectedJobId);
        setApplications(data);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoadingApps(false);
      }
    };

    loadApps();
  }, [selectedJobId]);

  // Publish job action
  const handlePublishJob = async (id: string) => {
    try {
      setActionLoading(`publish-${id}`);
      await publishJob(id);
      await loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Close job action
  const handleCloseJob = async (id: string) => {
    try {
      setActionLoading(`close-${id}`);
      await closeJob(id);
      await loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Update application status action
  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      setActionLoading(`app-${appId}`);
      await updateApplicationStatus(appId, status);
      // Reload applications
      if (selectedJobId) {
        const data = await fetchJobApplications(selectedJobId);
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <>
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={850} sx={{ letterSpacing: '-0.03em' }}>
              Кабінет роботодавця
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Керування вакансіями та відгуками кандидатів.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/jobs/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ px: 3.5, py: 1.25, fontWeight: 700 }}
          >
            Створити вакансію
          </Button>
        </Stack>

        {loadingJobs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : jobs.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              У вас ще немає створених вакансій
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Створіть свою першу пропозицію роботи прямо зараз!
            </Typography>
            <Button component={Link} href="/jobs/new" variant="contained" color="primary">
              Створити вакансію
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Left side: Job list */}
            <Grid item xs={12} md={5}>
              <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
                Ваші вакансії ({jobs.length})
              </Typography>
              <Stack spacing={2}>
                {jobs.map((job) => {
                  const active = job.id === selectedJobId;
                  const stat = getJobStatusStyle(job.status);
                  const isActLoad = actionLoading === `publish-${job.id}` || actionLoading === `close-${job.id}`;

                  return (
                    <Card
                      key={job.id}
                      variant="outlined"
                      onClick={() => setSelectedJobId(job.id)}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 3,
                        borderColor: active ? 'primary.main' : 'divider',
                        boxShadow: active ? '0 4px 18px rgba(43,76,126,0.06)' : 'none',
                        bgcolor: active ? 'background.paper' : 'transparent',
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                          borderColor: active ? 'primary.main' : 'grey.400',
                          bgcolor: 'background.paper',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                          <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                              {job.specialization}
                            </Typography>
                          </Box>
                          <Chip
                            label={stat.label}
                            size="small"
                            sx={{
                              bgcolor: stat.bg,
                              color: stat.color,
                              fontWeight: 750,
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: { xs: 'none', sm: 'block' } }}>
                          {job.summary || 'Немає короткого опису...'}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary" fontWeight={650}>
                            Створено: {new Date(job.createdAt).toLocaleDateString('uk-UA')}
                          </Typography>

                          <Stack direction="row" spacing={1}>
                            {job.status === 'DRAFT' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                disabled={isActLoad}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublishJob(job.id);
                                }}
                                startIcon={isActLoad ? <CircularProgress size={12} /> : <CheckCircleOutlineIcon />}
                                sx={{ py: 0.5, px: 2, borderRadius: 999, fontSize: '0.75rem' }}
                              >
                                Опублікувати
                              </Button>
                            )}
                            {job.status === 'PUBLISHED' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                disabled={isActLoad}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseJob(job.id);
                                }}
                                startIcon={isActLoad ? <CircularProgress size={12} /> : <CloseIcon />}
                                sx={{ py: 0.5, px: 2, borderRadius: 999, fontSize: '0.75rem' }}
                              >
                                Закрити
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Grid>

            {/* Right side: Applicants details */}
            <Grid item xs={12} md={7}>
              {selectedJob ? (
                <Box>
                  <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
                    Відгуки на: «{selectedJob.title}»
                  </Typography>

                  {loadingApps ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress color="primary" />
                    </Box>
                  ) : applications.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                        Ще немає жодного відгуку від кандидатів.
                      </Typography>
                    </Paper>
                  ) : (
                    <Stack spacing={3}>
                      {applications.map((app) => {
                        const doctor = app.doctor || {};
                        const profile = doctor.doctorProfile || {};
                        const isActLoad = actionLoading === `app-${app.id}`;
                        const appStyle = getAppStatusStyle(app.status);

                        return (
                          <Card key={app.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'visible' }}>
                            <CardContent sx={{ p: 3 }}>
                              {/* Doctor Header */}
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={8}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48, fontWeight: 700 }}>
                                      {doctor.firstName?.charAt(0) || 'D'}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="subtitle1" fontWeight={800}>
                                        {doctor.firstName} {doctor.lastName}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        {profile.specialization || 'Лікар'} • Досвід: {profile.yearsOfExp || 0} р.
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center' }}>
                                  <Chip
                                    label={appStyle.label}
                                    color={appStyle.color as any}
                                    size="small"
                                    sx={{ fontWeight: 750 }}
                                  />
                                </Grid>
                              </Grid>

                              {profile.bio && (
                                <Box sx={{ mt: 1.5, p: 2, bgcolor: 'background.default', borderRadius: 2.5 }}>
                                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
                                    Про лікаря
                                  </Typography>
                                  <Typography variant="body2" color="text.primary">
                                    {profile.bio}
                                  </Typography>
                                </Box>
                              )}

                              {app.coverLetter && (
                                <Box sx={{ mt: 1.5, p: 2, bgcolor: '#EDF2F9', borderRadius: 2.5, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
                                    Супровідний лист
                                  </Typography>
                                  <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                                    «{app.coverLetter}»
                                  </Typography>
                                </Box>
                              )}

                              <Box sx={{ mt: 1.5, display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                                {profile.city && (
                                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    Локація: {profile.city}, {profile.country || 'Україна'}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                  Дата подачі: {new Date(app.createdAt).toLocaleDateString('uk-UA')}
                                </Typography>
                              </Box>

                              <Divider sx={{ my: 2.5 }} />

                              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                                {/* Status Update Dropdown */}
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 220 }}>
                                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                                    Статус:
                                  </Typography>
                                  <FormControl size="small" fullWidth disabled={isActLoad || app.status === 'WITHDRAWN'}>
                                    <Select
                                      value={app.status}
                                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                      sx={{ borderRadius: 2, fontSize: '0.85rem' }}
                                    >
                                      <MenuItem value="SUBMITTED">Надіслано</MenuItem>
                                      <MenuItem value="REVIEWING">Розглядається</MenuItem>
                                      <MenuItem value="INTERVIEW">Призначити співбесіду</MenuItem>
                                      <MenuItem value="OFFER">Надіслати оффер</MenuItem>
                                      <MenuItem value="REJECTED">Відхилити відгук</MenuItem>
                                      {app.status === 'WITHDRAWN' && (
                                        <MenuItem value="WITHDRAWN">Відкликано лікарем</MenuItem>
                                      )}
                                    </Select>
                                  </FormControl>
                                </Stack>

                                {/* Chat Write button */}
                                <Button
                                  variant="outlined"
                                  disabled
                                  size="small"
                                  startIcon={<ChatBubbleOutlineIcon />}
                                  sx={{ borderRadius: 999 }}
                                >
                                  Написати (Чат незабаром)
                                </Button>
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Виберіть вакансію ліворуч, щоб побачити відгуки.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}

export default function EmployerDashboard() {
  return (
    <RoleGuard allowedRole="EMPLOYER">
      <EmployerDashboardContent />
    </RoleGuard>
  );
}

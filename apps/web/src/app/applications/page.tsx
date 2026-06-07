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
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LaunchIcon from '@mui/icons-material/Launch';

import { AppHeader } from '../../components/layout/AppHeader';
import { fetchMyApplications, withdrawApplication } from '../../lib/api/applications';
import { getAppStatusStyle } from '../../lib/format';
import { RoleGuard } from '../../components/auth/RoleGuard';

function DoctorApplicationsContent() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load doctor's applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await fetchMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Withdraw application action
  const handleWithdraw = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете відкликати цей відгук?')) return;

    try {
      setActionLoading(id);
      await withdrawApplication(id);
      await loadApplications();
    } catch (err) {
      console.error('Failed to withdraw application:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <AppHeader />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={850} sx={{ letterSpacing: '-0.03em', mb: 1 }}>
            Мої відгуки на вакансії
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Тут відображається статус усіх ваших поданих заявок.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : applications.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Ви ще не відгукнулися на жодну вакансію
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Знайдіть підходящі пропозиції роботи в нашій базі вакансій!
            </Typography>
            <Button component={Link} href="/jobs" variant="contained" color="primary">
              Знайти вакансії
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {applications.map((app) => {
              const job = app.job || {};
              const stat = getAppStatusStyle(app.status);
              const isWithdrawing = actionLoading === app.id;
              const isWithdrawDisabled = ['OFFER', 'REJECTED', 'WITHDRAWN'].includes(app.status);

              return (
                <Card key={app.id} variant="outlined" sx={{ borderRadius: 3.5 }}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }} gap={2}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          component={Link}
                          href={`/jobs/${job.id}`}
                          variant="h6"
                          fontWeight={800}
                          color="primary.dark"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            textDecoration: 'none',
                            lineHeight: 1.2,
                            mb: 0.5,
                            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                          }}
                        >
                          {job.title}
                          <LaunchIcon sx={{ fontSize: 16 }} />
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={650}>
                          Медичний заклад (Клініка)
                        </Typography>
                      </Box>
                      <Chip
                        label={stat.label}
                        color={stat.color as any}
                        sx={{ fontWeight: 750 }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5 }}>
                      {(job.city || job.country) && (
                        <Chip
                          icon={<LocationOnOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                          label={[job.city, job.country].filter(Boolean).join(', ')}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 650, color: 'text.secondary' }}
                        />
                      )}
                      <Chip
                        label={`Подано: ${new Date(app.createdAt).toLocaleDateString('uk-UA')}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 650, color: 'text.secondary' }}
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                      {/* Withdraw action */}
                      {!isWithdrawDisabled ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled={isWithdrawing}
                          onClick={() => handleWithdraw(app.id)}
                          startIcon={isWithdrawing ? <CircularProgress size={12} color="error" /> : <RemoveCircleOutlineIcon />}
                          sx={{ borderRadius: 999 }}
                        >
                          {isWithdrawing ? 'Відкликання...' : 'Відкликати відгук'}
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Дія недоступна для даного статусу
                        </Typography>
                      )}

                      {/* Chat placeholder */}
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
      </Container>
    </>
  );
}

export default function DoctorApplications() {
  return (
    <RoleGuard allowedRole="DOCTOR">
      <DoctorApplicationsContent />
    </RoleGuard>
  );
}

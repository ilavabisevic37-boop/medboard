'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { useAuth } from '../../application/auth/useAuth';
import { applyToJob, checkMyApplicationStatus } from '../../lib/api/applications';

interface ApplySectionProps {
  jobId: string;
}

export function ApplySection({ jobId }: ApplySectionProps) {
  const router = useRouter();
  const { role, isAuthenticated, loading: authLoading } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || role !== 'DOCTOR') {
      setLoading(false);
      return;
    }

    // Lightweight check — only fetches id, jobId, status (no nested job/doctor)
    checkMyApplicationStatus(jobId)
      .then(({ hasApplied }) => {
        setHasApplied(hasApplied);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId, isAuthenticated, role, authLoading]);

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} color="primary" />
      </Box>
    );
  }

  // EMPLOYER -> hide the apply button
  if (role === 'EMPLOYER') {
    return null;
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=/jobs/${jobId}`);
      return;
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCoverLetter('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await applyToJob(jobId, coverLetter || undefined);
      setHasApplied(true);
      setDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.errors?.[0]?.message || 'Щось пішло не так. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  if (hasApplied) {
    return (
      <Button
        variant="contained"
        disabled
        fullWidth
        size="large"
        startIcon={<CheckCircleOutlineRoundedIcon />}
        sx={{
          bgcolor: 'success.light',
          color: 'success.main',
          borderRadius: 8,
          py: 1.75,
          fontWeight: 700,
          '&.Mui-disabled': {
            bgcolor: 'success.light',
            color: 'success.main',
          },
        }}
      >
        Заявку подано
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handleApplyClick}
        sx={{
          borderRadius: 8,
          py: 1.75,
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(43, 76, 126, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(43, 76, 126, 0.3)',
          },
        }}
      >
        Відгукнутися
      </Button>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', pb: 1 }}>
          Супровідний лист
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Розкажіть роботодавцю, чому саме ваша кандидатура підходить на цю посаду. Додавання супровідного листа значно підвищує шанси на відповідь.
            </Typography>
            <TextField
              autoFocus
              multiline
              rows={5}
              placeholder="Напишіть декілька слів про свій досвід та мотивацію..."
              fullWidth
              variant="outlined"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={submitting}
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
            <Button
              onClick={handleClose}
              disabled={submitting}
              variant="outlined"
              sx={{ px: 3 }}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              sx={{ px: 4 }}
            >
              {submitting ? 'Надсилання...' : 'Надіслати відгук'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

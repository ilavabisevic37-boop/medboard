'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AppHeader } from '../../../components/layout/AppHeader';
import { createJob, publishJob } from '../../../lib/api/jobs';
import { RoleGuard } from '../../../components/auth/RoleGuard';
import { DynamicListInput } from '../../../components/ui/DynamicListInput';

function NewJobPageContent() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [shift, setShift] = useState('');
  const [experience, setExperience] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('WEEK');
  const [currency, setCurrency] = useState('UAH');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Україна');
  const [remote, setRemote] = useState(false);
  const [urgent, setUrgent] = useState(false);

  // Dynamic requirements and benefits list
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const [createdJobId, setCreatedJobId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (!title.trim() || !specialization.trim() || !description.trim()) {
      setError('Будь ласка, заповніть обов\'язкові поля (Назва, Спеціалізація, Опис).');
      return;
    }

    setSubmitting(true);
    setError(null);

    const input = {
      title,
      specialization,
      summary: summary || undefined,
      description,
      employmentType,
      shift: shift || undefined,
      experience: experience || undefined,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
      salaryPeriod,
      currency,
      city: city || undefined,
      country: country || undefined,
      remote,
      urgent,
      requirements,
      benefits,
    };

    try {
      let jobId = createdJobId;
      if (!jobId) {
        jobId = await createJob(input);
        setCreatedJobId(jobId);
      }
      if (action === 'publish') {
        await publishJob(jobId);
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.errors?.[0]?.message || 'Помилка при створенні вакансії.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Back button */}
        <Button
          onClick={() => router.push('/dashboard')}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, fontWeight: 700 }}
        >
          Назад до кабінету
        </Button>

        {/* Title */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={850} sx={{ letterSpacing: '-0.03em', mb: 1 }}>
            Створення вакансії
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Заповніть форму для створення нової вакансії на MedBoard.
          </Typography>
        </Box>

        {error && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', color: 'error.main', borderRadius: 3, fontWeight: 700 }}>
            {error}
          </Box>
        )}

        {submitting && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <Card variant="outlined" sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h6" fontWeight={750} sx={{ mb: 3 }}>
              Основна інформація
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Назва вакансії *"
                  placeholder="наприклад, Лікар-кардіолог"
                  fullWidth
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Спеціалізація *"
                  placeholder="наприклад, Кардіологія"
                  fullWidth
                  variant="outlined"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип зайнятості</InputLabel>
                  <Select
                    value={employmentType}
                    label="Тип зайнятості"
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <MenuItem value="FULL_TIME">Повна зайнятість</MenuItem>
                    <MenuItem value="PART_TIME">Часткова зайнятість</MenuItem>
                    <MenuItem value="CONTRACT">Контракт</MenuItem>
                    <MenuItem value="LOCUM">Тимчасова робота (Locum)</MenuItem>
                    <MenuItem value="INTERNSHIP">Стажування</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Зміна / графік роботи"
                  placeholder="наприклад, Денна, Подобово"
                  fullWidth
                  variant="outlined"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Необхідний досвід"
                  placeholder="наприклад, Від 2 років"
                  fullWidth
                  variant="outlined"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Короткий опис"
                  placeholder="Короткий опис для прев'ю вакансії..."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Детальний опис *"
                  placeholder="Опишіть обов'язки, умови та очікування від кандидата..."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={750} sx={{ mb: 3 }}>
              Локація та умови
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Місто"
                  placeholder="наприклад, Київ"
                  fullWidth
                  variant="outlined"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Країна"
                  placeholder="наприклад, Україна"
                  fullWidth
                  variant="outlined"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remote}
                      onChange={(e) => setRemote(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Можливість працювати віддалено (Remote)"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Термінова вакансія (Urgent)"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={750} sx={{ mb: 3 }}>
              Оплата
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Мін. зарплата"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Макс. зарплата"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Період оплати</InputLabel>
                  <Select
                    value={salaryPeriod}
                    label="Період оплати"
                    onChange={(e) => setSalaryPeriod(e.target.value)}
                  >
                    <MenuItem value="HOUR">За годину</MenuItem>
                    <MenuItem value="WEEK">За тиждень</MenuItem>
                    <MenuItem value="YEAR">За рік</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Валюта</InputLabel>
                  <Select
                    value={currency}
                    label="Валюта"
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="UAH">₴ (UAH)</MenuItem>
                    <MenuItem value="USD">$ (USD)</MenuItem>
                    <MenuItem value="EUR">€ (EUR)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <DynamicListInput
              title="Вимоги (Requirements)"
              placeholder="Введіть вимогу до кандидата..."
              items={requirements}
              onChange={setRequirements}
            />

            <DynamicListInput
              title="Переваги (Benefits)"
              placeholder="Введіть перевагу або бонус..."
              items={benefits}
              onChange={setBenefits}
            />
          </CardContent>
        </Card>

        <Stack direction="row" spacing={3} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => handleSubmit('draft')}
            sx={{ px: 4, py: 1.5 }}
          >
            Зберегти чернетку
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit('publish')}
            sx={{ px: 4, py: 1.5 }}
          >
            Опублікувати
          </Button>
        </Stack>
      </Container>
    </>
  );
}

export default function NewJobPage() {
  return (
    <RoleGuard allowedRole="EMPLOYER">
      <NewJobPageContent />
    </RoleGuard>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AppHeader } from '../../../components/layout/AppHeader';
import { useAuth } from '../../../application/auth/useAuth';
import { createJob, publishJob } from '../../../lib/api/jobs';

export default function NewJobPage() {
  const router = useRouter();
  const { role, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if not employer
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?next=/jobs/new');
      } else if (role !== 'EMPLOYER') {
        router.push('/jobs');
      }
    }
  }, [isAuthenticated, role, authLoading, router]);

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
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benInput, setBenInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRequirement = () => {
    if (reqInput.trim()) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleAddBenefit = () => {
    if (benInput.trim()) {
      setBenefits([...benefits, benInput.trim()]);
      setBenInput('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

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
      const jobId = await createJob(input);
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

  if (authLoading || submitting) {
    return (
      <>
        <AppHeader />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2 }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" color="text.secondary">
            {submitting ? 'Збереження вакансії...' : 'Перевірка авторизації...'}
          </Typography>
        </Box>
      </>
    );
  }

  if (role !== 'EMPLOYER') {
    return null;
  }

  return (
    <>
      <AppHeader />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          onClick={() => router.push('/dashboard')}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, fontWeight: 700, color: 'text.secondary' }}
        >
          Назад до кабінету
        </Button>

        <Typography variant="h4" fontWeight={850} sx={{ mb: 1, letterSpacing: '-0.03em' }}>
          Створення нової вакансії
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Заповніть інформацію нижче, щоб додати пропозицію роботи для лікарів.
        </Typography>

        {error && (
          <Box sx={{ p: 2.5, bgcolor: 'error.light', color: 'error.main', borderRadius: 3, mb: 4, fontWeight: 650 }}>
            {error}
          </Box>
        )}

        <Card variant="outlined" sx={{ borderRadius: 4, p: { xs: 2, md: 4 } }}>
          <CardContent>
            <Typography variant="h6" fontWeight={750} sx={{ mb: 3 }}>
              Загальна інформація
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
                <TextField
                  label="Досвід роботи"
                  placeholder="наприклад, від 2 років"
                  fullWidth
                  variant="outlined"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Короткий опис (Summary)"
                  placeholder="Короткий огляд вакансії в 1-2 реченнях..."
                  fullWidth
                  variant="outlined"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Повний опис вакансії *"
                  placeholder="Детальні обов'язки, умови та вимоги..."
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={750} sx={{ mb: 3 }}>
              Умови зайнятості та локація
            </Typography>

            <Grid container spacing={3}>
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
                    <MenuItem value="LOCUM">Тимчасова робота / Локум</MenuItem>
                    <MenuItem value="INTERNSHIP">Стажування / Інтернатура</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Зміна</InputLabel>
                  <Select
                    value={shift}
                    label="Зміна"
                    onChange={(e) => setShift(e.target.value)}
                  >
                    <MenuItem value="">Не вказано</MenuItem>
                    <MenuItem value="DAY">Денна зміна</MenuItem>
                    <MenuItem value="NIGHT">Нічна зміна</MenuItem>
                    <MenuItem value="ROTATING">Змінний графік</MenuItem>
                    <MenuItem value="WEEKEND">Робота у вихідні</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

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

            <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
              Вимоги (Requirements)
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                placeholder="Введіть вимогу до кандидата..."
                fullWidth
                variant="outlined"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
              />
              <Button variant="outlined" onClick={handleAddRequirement} startIcon={<AddIcon />}>
                Додати
              </Button>
            </Stack>
            <List dense sx={{ mb: 3 }}>
              {requirements.map((req, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveRequirement(idx)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  sx={{ bgcolor: 'background.default', borderRadius: 2, mb: 1 }}
                >
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
              Переваги (Benefits)
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                placeholder="Введіть перевагу або бонус..."
                fullWidth
                variant="outlined"
                value={benInput}
                onChange={(e) => setBenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
              />
              <Button variant="outlined" onClick={handleAddBenefit} startIcon={<AddIcon />}>
                Додати
              </Button>
            </Stack>
            <List dense>
              {benefits.map((ben, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveBenefit(idx)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  sx={{ bgcolor: 'background.default', borderRadius: 2, mb: 1 }}
                >
                  <ListItemText primary={ben} />
                </ListItem>
              ))}
            </List>
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

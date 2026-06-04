'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="overline" color="primary">
          MedBoard
        </Typography>
        <Typography variant="h2" component="h1" fontWeight={700}>
          Робота для медиків. Без зайвого шуму.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Платформа, що з’єднує лікарів і медичні установи. Шукай вакансії, керуй заявками,
          публікуй пропозиції.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} href="/jobs" variant="contained" size="large">
            Знайти роботу
          </Button>
          <Button component={Link} href="/employers" variant="outlined" size="large">
            Для роботодавців
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

import { Box, Container, Typography } from '@mui/material';

import { Logo } from '../ui/Logo';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2.25,
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2.25, md: 3.5 },
        }}
      >
        <Logo size={24} />
        <Typography
          variant="body2"
          sx={{ color: '#8896A6', fontSize: 13 }}
        >
          © 2026 Medboard, Inc. · Built for healthcare hiring.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            color: '#8896A6',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', cursor: 'pointer' }}>
            Privacy
          </Typography>
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', cursor: 'pointer' }}>
            Terms
          </Typography>
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit', cursor: 'pointer' }}>
            Trust &amp; safety
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
  children: React.ReactNode;
}

export default function AuthFormContainer({
  title,
  subtitle,
  switchPrompt,
  switchLabel,
  switchHref,
  children,
}: AuthFormContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '420px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: { xs: 'auto', md: '100%' },
        py: { xs: '40px', md: '48px' },
      }}
    >
      <Box sx={{ mb: '20px' }}>
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              color: 'grey.400',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: '12px' }} />
            Back to home
          </Box>
        </Link>
      </Box>

      <Box sx={{ mb: '8px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '30px',
            fontWeight: 800,
            color: 'text.primary',
            lineHeight: 1.08,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '13.5px',
            color: 'text.secondary',
            mt: '8px',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {children}

      <Box
        sx={{
          textAlign: 'center',
          mt: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {switchPrompt}
        </Typography>
        <Typography
          component={Link}
          href={switchHref}
          sx={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {switchLabel}
        </Typography>
      </Box>
    </Box>
  );
}

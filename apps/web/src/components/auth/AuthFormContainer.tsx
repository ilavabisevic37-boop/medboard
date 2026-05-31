import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import SignInForm from './SignInForm';

export default function AuthFormContainer() {
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
      {/* Top: Back to home link */}
      <Box sx={{ mb: '32px' }}>
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6B7280', // Gray-500
              fontSize: '13px',
              fontWeight: 600,
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#111827', // Gray-900
              },
            }}
          >
            {/* Left arrow icon */}
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'rotate(180deg)' }}
            >
              <path
                d="M9 1L13 5M13 5L9 9M13 5H1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </Box>
        </Link>
      </Box>

      {/* Header section */}
      <Box sx={{ mb: '8px' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          Sign in
        </Typography>
        <Typography
          sx={{
            fontSize: '14.5px',
            color: '#6B7280',
            mt: '6px',
            fontWeight: 500,
          }}
        >
          Welcome back. Enter your details to continue.
        </Typography>
      </Box>

      {/* Main Credentials Form */}
      <SignInForm />

      {/* Divider */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: '24px',
          width: '100%',
        }}
      >
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#E5E7EB' }} />
        <Typography
          sx={{
            px: '14px',
            color: '#9CA3AF',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          or
        </Typography>
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#E5E7EB' }} />
      </Box>

      {/* SSO Action Button */}
      <Button
        component={Link}
        href="/auth/sso"
        fullWidth
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: '50px',
          height: '48px',
          bgcolor: '#ffffff',
          color: '#374151',
          textTransform: 'none',
          fontSize: '14.5px',
          fontWeight: 700,
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#F9FAFB',
            borderColor: '#D1D5DB',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {/* Document/SSO Icon */}
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1H2C1.44772 1 1 1.44772 1 2V16C1 16.5523 1.44772 17 2 17H14C14.5523 17 15 16.5523 15 16V7L9 1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 1V7H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Continue with SSO
      </Button>

      {/* Sign-up footer */}
      <Box
        sx={{
          textAlign: 'center',
          mt: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <Typography
          sx={{
            fontSize: '13.5px',
            color: '#6B7280',
            fontWeight: 500,
          }}
        >
          New to Medboard?
        </Typography>
        <Typography
          component={Link}
          href="/signup"
          sx={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#5B7BE8',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Create an account
        </Typography>
      </Box>
    </Box>
  );
}

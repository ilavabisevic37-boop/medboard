import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
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
        py: { xs: '40px', md: 0 },
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
          Sign in
        </Typography>
        <Typography
          sx={{
            fontSize: '13.5px',
            color: 'text.secondary',
            mt: '8px',
            fontWeight: 500,
          }}
        >
          Welcome back. Enter your details to continue.
        </Typography>
      </Box>

      <SignInForm />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: '22px',
          width: '100%',
        }}
      >
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
        <Typography
          sx={{
            px: '14px',
            color: 'grey.400',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          or
        </Typography>
        <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
      </Box>

      <Button
        component={Link}
        href="/auth/sso"
        fullWidth
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '50px',
          height: '42px',
          bgcolor: 'background.paper',
          color: 'text.secondary',
          textTransform: 'none',
          fontSize: '13.5px',
          fontWeight: 700,
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'background.default',
            borderColor: 'grey.400',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <ArticleOutlinedIcon sx={{ fontSize: '17px' }} />
        Continue with SSO
      </Button>

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
          New to Medboard?
        </Typography>
        <Typography
          component={Link}
          href="/signup"
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
          Create an account
        </Typography>
      </Box>
    </Box>
  );
}

"use client";

import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import Link from 'next/link';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { SignInCredentials } from '../../../domain/auth/credentials.schema';

interface SignInActionsProps {
  control: Control<SignInCredentials>;
  isSubmitting: boolean;
}

export function SignInActions({ control, isSubmitting }: SignInActionsProps) {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '-2px' }}>
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  sx={{
                    p: '6px',
                    color: '#D1D5DB',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                    borderRadius: '4px',
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.secondary', userSelect: 'none' }}>
                  Remember me
                </Typography>
              }
              sx={{ mr: 0 }}
            />
          )}
        />

        <Button
          component={Link}
          href="/forgot-password"
          variant="text"
          sx={{
            minWidth: 'auto',
            px: 0,
            fontSize: '13px',
            fontWeight: 700,
            color: 'primary.dark',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Forgot password?
        </Button>
      </Box>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="contained"
        fullWidth
        sx={{
          borderRadius: '50px',
          height: '48px',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          textTransform: 'none',
          fontSize: '14.5px',
          fontWeight: 700,
          boxShadow: 'none',
          gap: '8px',
          mt: '4px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            bgcolor: 'primary.dark',
            boxShadow: '0px 8px 18px rgba(74, 127, 212, 0.22)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(74, 127, 212, 0.34)',
            color: 'rgba(255, 255, 255, 0.86)',
          },
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={18} color="inherit" thickness={5} />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 1L13 5M13 5L9 9M13 5H1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </Button>
    </>
  );
}

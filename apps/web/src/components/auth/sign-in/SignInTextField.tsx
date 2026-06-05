"use client";

import React from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Box, FormHelperText, InputAdornment, TextField, Typography } from '@mui/material';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { SignInCredentials } from '../../../domain/auth/credentials.schema';

interface EmailFieldProps {
  control: Control<SignInCredentials>;
  errors: FieldErrors<SignInCredentials>;
}

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: 'background.paper',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontSize: '13.5px',
    height: '48px',
    '& fieldset': {
      borderColor: 'divider',
    },
    '&:hover fieldset': {
      borderColor: 'grey.400',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: '1.5px',
    },
  },
} as const;

export function EmailField({ control, errors }: EmailFieldProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <Typography component="label" htmlFor="email" sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}>
        Email address
      </Typography>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id="email"
            placeholder="you@clinic.com"
            type="email"
            fullWidth
            error={!!errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: '8px', color: 'grey.400' }}>
                  <EmailOutlinedIcon sx={{ fontSize: '17px' }} />
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />
        )}
      />
      {errors.email && (
        <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
          {errors.email.message}
        </FormHelperText>
      )}
    </Box>
  );
}

"use client";

import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, FormHelperText, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { SignInCredentials } from '../../../domain/auth/credentials.schema';
import { fieldSx } from './SignInTextField';

interface PasswordFieldProps {
  control: Control<SignInCredentials>;
  errors: FieldErrors<SignInCredentials>;
}

export function PasswordField({ control, errors }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <Typography component="label" htmlFor="password" sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}>
        Password
      </Typography>
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id="password"
            placeholder="********"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            error={!!errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: '8px', color: 'grey.400' }}>
                  <LockOutlinedIcon sx={{ fontSize: '17px' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((value) => !value)}
                    edge="end"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    sx={{ color: 'grey.400' }}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />
        )}
      />
      {errors.password && (
        <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
          {errors.password.message}
        </FormHelperText>
      )}
    </Box>
  );
}

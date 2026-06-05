"use client";

import React from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Alert, Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useSignIn } from '../../application/auth/useSignIn';
import { signInCredentialsSchema, type SignInCredentials } from '../../domain/auth/credentials.schema';
import { AuthPasswordField, AuthSubmitButton, AuthTextField } from './fields';

export default function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInCredentials>({
    resolver: zodResolver(signInCredentialsSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });
  const { submit, isSubmitting, errorMessage, successMessage } = useSignIn();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submit)}
      noValidate
      sx={{
        width: '100%',
        mt: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {errorMessage && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <AuthTextField
        control={control}
        name="email"
        label="Email address"
        placeholder="you@clinic.com"
        type="email"
        autoComplete="email"
        icon={<EmailOutlinedIcon sx={{ fontSize: '17px' }} />}
        errorMessage={errors.email?.message}
      />
      <AuthPasswordField
        control={control}
        name="password"
        autoComplete="current-password"
        errorMessage={errors.password?.message}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '-2px' }}>
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
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
        {/* "Forgot password?" lands together with the Supabase reset flow (see ROADMAP §2.1). */}
      </Box>

      <AuthSubmitButton label="Sign in" busyLabel="Signing in..." isSubmitting={isSubmitting} />
    </Box>
  );
}

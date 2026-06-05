"use client";

import React from 'react';
import { Alert, Box } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSignIn } from '../../application/auth/useSignIn';
import { signInCredentialsSchema, type SignInCredentials } from '../../domain/auth/credentials.schema';
import { SignInActions } from './sign-in/SignInActions';
import { EmailField } from './sign-in/SignInTextField';
import { PasswordField } from './sign-in/PasswordField';

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

      <EmailField control={control} errors={errors} />
      <PasswordField control={control} errors={errors} />
      <SignInActions control={control} isSubmitting={isSubmitting} />
    </Box>
  );
}

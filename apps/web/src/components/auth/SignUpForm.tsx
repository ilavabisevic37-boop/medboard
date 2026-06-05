"use client";

import React from 'react';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Alert, Box, Checkbox, FormHelperText, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useSignUp } from '../../application/auth/useSignUp';
import { signUpCredentialsSchema, type SignUpCredentials } from '../../domain/auth/credentials.schema';
import { AuthPasswordField, AuthSubmitButton, AuthTextField } from './fields';
import { RoleCards } from './RoleCards';

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpCredentials>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: {
      role: 'DOCTOR',
      fullName: '',
      detail: '',
      email: '',
      password: '',
      agree: false,
    },
  });
  const { submit, isSubmitting, errorMessage, successMessage } = useSignUp();

  const role = watch('role');
  const isClinic = role === 'EMPLOYER';

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

      <Controller
        name="role"
        control={control}
        render={({ field }) => <RoleCards value={field.value} onChange={field.onChange} />}
      />

      <AuthTextField
        control={control}
        name="fullName"
        label={isClinic ? 'Your name' : 'Full name'}
        placeholder={isClinic ? 'Jordan Smith' : 'Dr. Jordan Smith'}
        autoComplete="name"
        icon={<PersonOutlineRoundedIcon sx={{ fontSize: '17px' }} />}
        errorMessage={errors.fullName?.message}
      />

      <AuthTextField
        control={control}
        name="detail"
        label={isClinic ? 'Organization' : 'Primary specialty'}
        placeholder={isClinic ? "Riverside Children's Clinic" : 'e.g. Emergency Medicine'}
        icon={
          isClinic ? (
            <BusinessRoundedIcon sx={{ fontSize: '17px' }} />
          ) : (
            <MedicalServicesOutlinedIcon sx={{ fontSize: '17px' }} />
          )
        }
        errorMessage={errors.detail?.message}
      />

      <AuthTextField
        control={control}
        name="email"
        label="Work email"
        placeholder="you@clinic.com"
        type="email"
        autoComplete="email"
        icon={<EmailOutlinedIcon sx={{ fontSize: '17px' }} />}
        errorMessage={errors.email?.message}
      />

      <AuthPasswordField
        control={control}
        name="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        errorMessage={errors.password?.message}
      />

      <Box>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <Box
              component="label"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
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
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.secondary' }}>
                I agree to the{' '}
                <Box component="b" sx={{ color: 'primary.dark' }}>
                  Terms
                </Box>{' '}
                and{' '}
                <Box component="b" sx={{ color: 'primary.dark' }}>
                  Privacy Policy
                </Box>
                .
              </Typography>
            </Box>
          )}
        />
        {errors.agree && (
          <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
            {errors.agree.message}
          </FormHelperText>
        )}
      </Box>

      <AuthSubmitButton
        label="Create account"
        busyLabel="Creating account..."
        isSubmitting={isSubmitting}
      />

      <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', textAlign: 'center' }}>
        {isClinic
          ? 'Clinic accounts are reviewed within one business day.'
          : "Credential verification happens after sign-up — it's quick."}
      </Typography>
    </Box>
  );
}

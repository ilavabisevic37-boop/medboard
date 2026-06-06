"use client";

import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

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

interface AuthTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  errorMessage?: string;
}

export function AuthTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  icon,
  errorMessage,
}: AuthTextFieldProps<T>) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <Typography
        component="label"
        htmlFor={name}
        sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id={name}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            fullWidth
            error={!!errorMessage}
            InputProps={{
              startAdornment: icon ? (
                <InputAdornment position="start" sx={{ mr: '8px', color: 'grey.400' }}>
                  {icon}
                </InputAdornment>
              ) : undefined,
            }}
            sx={fieldSx}
          />
        )}
      />
      {errorMessage && (
        <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
}

interface AuthPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  errorMessage?: string;
}

export function AuthPasswordField<T extends FieldValues>({
  control,
  name,
  label = 'Password',
  placeholder = '********',
  autoComplete,
  errorMessage,
}: AuthPasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <Typography
        component="label"
        htmlFor={name}
        sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id={name}
            placeholder={placeholder}
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            fullWidth
            error={!!errorMessage}
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
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />
        )}
      />
      {errorMessage && (
        <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
}

interface AuthSubmitButtonProps {
  label: string;
  busyLabel: string;
  isSubmitting: boolean;
}

export function AuthSubmitButton({ label, busyLabel, isSubmitting }: AuthSubmitButtonProps) {
  return (
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
          <span>{busyLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );
}

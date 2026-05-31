"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { signIn } from '../../lib/api/auth';

// Zod validation schema
const schema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await signIn(data);

      if (result.success) {
        setSuccessMessage('Successfully signed in! Redirecting...');
        // Wait briefly to show success state before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setErrorMessage(result.error ?? 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: '100%',
        mt: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {errorMessage && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ borderRadius: '8px' }}>
          {successMessage}
        </Alert>
      )}

      {/* Email Field */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Typography
          component="label"
          htmlFor="email"
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#4B5563', // Slate-600
          }}
        >
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
                  <InputAdornment position="start" sx={{ mr: '10px' }}>
                    {/* Envelope icon */}
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 1H16.5C17.3 1 18 1.7 18 2.5V11.5C18 12.3 17.3 13 16.5 13H1.5C0.7 13 0 12.3 0 11.5V2.5C0 1.7 0.7 1 1.5 1Z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 2.5L9 8.5L0 2.5"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#ffffff',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  fontSize: '14.5px',
                  '& fieldset': {
                    borderColor: '#E5E7EB', // Gray-200
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5B7BE8', // Primary brand color
                    borderWidth: '1.5px',
                  },
                },
              }}
            />
          )}
        />
        {errors.email && (
          <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
            {errors.email.message}
          </FormHelperText>
        )}
      </Box>

      {/* Password Field */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Typography
          component="label"
          htmlFor="password"
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#4B5563',
          }}
        >
          Password
        </Typography>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={!!errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: '10px' }}>
                    {/* Security check/shield icon */}
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 0.5L1.5 3V8C1.5 12.3 4.28 16.3 8 17.5C11.72 16.3 14.5 12.3 14.5 8V3L8 0.5Z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5V11"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{ color: '#9CA3AF' }}
                    >
                      {showPassword ? (
                        /* Eye Open */
                        <svg
                          width="18"
                          height="14"
                          viewBox="0 0 18 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        /* Eye Closed */
                        <svg
                          width="18"
                          height="14"
                          viewBox="0 0 18 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.5 1.5L15.5 12.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#ffffff',
                  fontSize: '14.5px',
                  '& fieldset': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5B7BE8',
                    borderWidth: '1.5px',
                  },
                },
              }}
            />
          )}
        />
        {errors.password && (
          <FormHelperText error sx={{ ml: '4px', mt: '2px', fontSize: '11px', fontWeight: 500 }}>
            {errors.password.message}
          </FormHelperText>
        )}
      </Box>

      {/* Row: Remember Me & Forgot Password */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: '-4px',
        }}
      >
        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  sx={{
                    color: '#D1D5DB',
                    '&.Mui-checked': {
                      color: '#5B7BE8',
                    },
                    borderRadius: '4px',
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#4B5563',
                    userSelect: 'none',
                  }}
                >
                  Remember me
                </Typography>
              }
            />
          )}
        />

        <Typography
          component="a"
          href="#"
          onClick={(e) => e.preventDefault()}
          sx={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#5B7BE8',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Forgot password?
        </Typography>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="contained"
        fullWidth
        sx={{
          bgcolor: '#5B7BE8',
          color: '#ffffff',
          borderRadius: '50px',
          height: '48px',
          textTransform: 'none',
          fontSize: '14.5px',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          mt: '8px',
          '&:hover': {
            bgcolor: '#4A6AD6',
            boxShadow: '0px 4px 12px rgba(91, 123, 232, 0.25)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(91, 123, 232, 0.6)',
            color: 'rgba(255, 255, 255, 0.8)',
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
    </Box>
  );
}

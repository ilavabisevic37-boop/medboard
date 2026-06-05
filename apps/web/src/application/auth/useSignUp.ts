"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { SignUpCredentials } from '../../domain/auth/credentials.schema';
import { authApi } from '../../lib/api/auth';
import type { AuthService } from './auth.service';

interface UseSignUpOptions {
  authService?: AuthService;
  redirectTo?: string;
  redirectDelayMs?: number;
}

interface SignUpState {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

export function useSignUp({
  authService = authApi,
  redirectTo = '/',
  redirectDelayMs = 1000,
}: UseSignUpOptions = {}) {
  const router = useRouter();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<SignUpState>({
    isSubmitting: false,
    errorMessage: null,
    successMessage: null,
  });

  const clearRedirectTimer = useCallback(() => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearRedirectTimer, [clearRedirectTimer]);

  const submit = useCallback(
    async (credentials: SignUpCredentials) => {
      clearRedirectTimer();
      setState({ isSubmitting: true, errorMessage: null, successMessage: null });

      try {
        const result = await authService.signUp(credentials);

        if (!result.success) {
          setState({
            isSubmitting: false,
            errorMessage: result.error ?? 'Could not create the account. Please try again.',
            successMessage: null,
          });
          return;
        }

        if (result.requiresEmailConfirmation) {
          // No session yet — Supabase sent a confirmation link.
          setState({
            isSubmitting: false,
            errorMessage: null,
            successMessage: 'Account created! Check your inbox and confirm your email to sign in.',
          });
          return;
        }

        setState({
          isSubmitting: true,
          errorMessage: null,
          successMessage: 'Account created! Redirecting...',
        });

        redirectTimerRef.current = setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, redirectDelayMs);
      } catch {
        setState({
          isSubmitting: false,
          errorMessage: 'An unexpected error occurred. Please try again.',
          successMessage: null,
        });
      }
    },
    [authService, clearRedirectTimer, redirectDelayMs, redirectTo, router]
  );

  return {
    ...state,
    submit,
  };
}

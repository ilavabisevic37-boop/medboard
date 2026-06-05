"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { SignInCredentials } from '../../domain/auth/credentials.schema';
import { authApi } from '../../lib/api/auth';
import type { AuthService } from './auth.service';

interface UseSignInOptions {
  authService?: AuthService;
  redirectTo?: string;
  redirectDelayMs?: number;
}

interface SignInState {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

export function useSignIn({
  authService = authApi,
  redirectTo = '/dashboard',
  redirectDelayMs = 1000,
}: UseSignInOptions = {}) {
  const router = useRouter();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<SignInState>({
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
    async (credentials: SignInCredentials) => {
      clearRedirectTimer();
      setState({ isSubmitting: true, errorMessage: null, successMessage: null });

      try {
        const result = await authService.signIn(credentials);

        if (!result.success) {
          setState({
            isSubmitting: false,
            errorMessage: result.error ?? 'Authentication failed. Please check your credentials.',
            successMessage: null,
          });
          return;
        }

        setState({
          isSubmitting: true,
          errorMessage: null,
          successMessage: 'Successfully signed in! Redirecting...',
        });

        redirectTimerRef.current = setTimeout(() => {
          router.push(redirectTo);
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

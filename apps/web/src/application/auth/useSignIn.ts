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
  redirectTo = '/',
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
          // Honor ?next=/jobs/123 set by guarded routes; only same-origin paths.
          const next = new URLSearchParams(window.location.search).get('next');
          router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : redirectTo);
          // Re-run the middleware + server components so the session cookie
          // (sb-access-token) is reflected in the UI immediately.
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

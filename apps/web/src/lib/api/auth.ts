import type { AuthService, SignInResponse, SignUpResponse } from '../../application/auth/auth.service';
import type { SignInCredentials, SignUpCredentials } from '../../domain/auth/credentials.schema';
import { createClient } from '../supabase/client';

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName: firstName ?? '', lastName: rest.join(' ') };
}

async function signIn({ email, password }: SignInCredentials): Promise<SignInResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: {
      email: data.user.email ?? email,
      name: data.user.user_metadata?.firstName ?? '',
    },
  };
}

async function signUp(credentials: SignUpCredentials): Promise<SignUpResponse> {
  const supabase = createClient();
  const { firstName, lastName } = splitFullName(credentials.fullName);

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      // Lands in raw_user_meta_data — the API webhook (POST /auth/webhook)
      // syncs role/firstName/lastName into our users table.
      data: {
        role: credentials.role,
        firstName,
        lastName,
        ...(credentials.detail
          ? credentials.role === 'DOCTOR'
            ? { specialization: credentials.detail }
            : { organization: credentials.detail }
          : {}),
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Supabase returns a user with no identities when the email is already taken.
  if (data.user && data.user.identities?.length === 0) {
    return { success: false, error: 'This email is already registered. Try signing in instead.' };
  }

  return { success: true, requiresEmailConfirmation: !data.session };
}

export const authApi: AuthService = {
  signIn,
  signUp,
};

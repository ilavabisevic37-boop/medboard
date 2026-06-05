import type { SignInCredentials, SignUpCredentials } from '../../domain/auth/credentials.schema';

export interface SignInResponse {
  success: boolean;
  error?: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface SignUpResponse {
  success: boolean;
  error?: string;
  /** True when Supabase requires the user to confirm their email before signing in. */
  requiresEmailConfirmation?: boolean;
}

export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<SignInResponse>;
  signUp(credentials: SignUpCredentials): Promise<SignUpResponse>;
}

import type { SignInCredentials } from '../../domain/auth/credentials.schema';

export interface SignInResponse {
  success: boolean;
  error?: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<SignInResponse>;
}

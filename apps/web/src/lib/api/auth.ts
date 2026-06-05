import type { AuthService, SignInResponse } from '../../application/auth/auth.service';
import type { SignInCredentials } from '../../domain/auth/credentials.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const SIGN_IN_URL = `${API_URL}/auth/signin`;

async function signIn(credentials: SignInCredentials): Promise<SignInResponse> {
  // TODO: replace this mock with a POST to SIGN_IN_URL when the auth API is available.
  void SIGN_IN_URL;
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { email, password } = credentials;

  if (!email || !password) {
    return {
      success: false,
      error: 'Please fill in both email and password.',
    };
  }

  // Allow successful login for demo
  return {
    success: true,
    user: {
      email,
      name: email.split('@')[0],
    },
  };
}

export const authApi: AuthService = {
  signIn,
};

/**
 * Authentication API helpers.
 */

export interface SignInResponse {
  success: boolean;
  error?: string;
  user?: {
    email: string;
    name: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

/**
 * Simulates a sign-in request to a backend API.
 * In a real implementation, this would make a POST request to `${API_URL}/auth/signin`
 * or use next-auth's signIn method.
 */
export async function signIn(credentials: Record<string, any>): Promise<SignInResponse> {
  // Simulate network latency (e.g., 1.5 seconds) to demonstrate the submit button's loading state.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { email, password } = credentials;

  // For testing purposes: Accept any valid inputs.
  // In a real environment, we'd fetch from `${API_URL}/auth/signin`
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

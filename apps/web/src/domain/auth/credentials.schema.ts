import { z } from 'zod';

export const signInCredentialsSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export type SignInCredentials = z.infer<typeof signInCredentialsSchema>;

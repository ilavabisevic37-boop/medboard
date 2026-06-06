import { z } from 'zod';

export const signInCredentialsSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export type SignInCredentials = z.infer<typeof signInCredentialsSchema>;

export const signUpRoles = ['DOCTOR', 'EMPLOYER'] as const;
export type SignUpRole = (typeof signUpRoles)[number];

export const signUpCredentialsSchema = z.object({
  role: z.enum(signUpRoles),
  fullName: z.string().trim().min(2, 'Please enter your name'),
  // Specialty for professionals, organization for clinics. Stored in Supabase
  // user metadata for now; profile editing lands with the /profile vertical.
  detail: z.string().trim().max(120, 'Keep it under 120 characters').optional(),
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agree: z.boolean().refine((value) => value, 'Please accept the Terms and Privacy Policy'),
});

export type SignUpCredentials = z.infer<typeof signUpCredentialsSchema>;

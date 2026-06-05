import React from 'react';
import type { Metadata } from 'next';

import AuthLayout from '../../../components/auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Sign In - Medboard',
  description: 'Sign in to Medboard to manage your medical jobs, applications, and professional profile matches.',
};

export default function SignInPage() {
  return <AuthLayout />;
}

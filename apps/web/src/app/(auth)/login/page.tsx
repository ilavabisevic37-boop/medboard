import React from 'react';
import type { Metadata } from 'next';

import AuthFormContainer from '../../../components/auth/AuthFormContainer';
import AuthLayout from '../../../components/auth/AuthLayout';
import SignInForm from '../../../components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - Medboard',
  description: 'Sign in to Medboard to manage your medical jobs, applications, and professional profile matches.',
};

export default function LoginPage() {
  return (
    <AuthLayout mode="login">
      <AuthFormContainer
        title="Sign in"
        subtitle="Welcome back. Enter your details to continue."
        switchPrompt="New to Medboard?"
        switchLabel="Create an account"
        switchHref="/register"
      >
        <SignInForm />
      </AuthFormContainer>
    </AuthLayout>
  );
}

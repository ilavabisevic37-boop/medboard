import React from 'react';
import type { Metadata } from 'next';

import AuthFormContainer from '../../../components/auth/AuthFormContainer';
import AuthLayout from '../../../components/auth/AuthLayout';
import SignUpForm from '../../../components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Create your account - Medboard',
  description: 'Join Medboard as a healthcare professional or a hiring clinic. Start in under two minutes.',
};

export default function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <AuthFormContainer
        title="Create your account"
        subtitle="Start in under two minutes. Tell us who you are."
        switchPrompt="Already have an account?"
        switchLabel="Sign in"
        switchHref="/login"
      >
        <SignUpForm />
      </AuthFormContainer>
    </AuthLayout>
  );
}

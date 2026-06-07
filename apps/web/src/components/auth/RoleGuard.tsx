'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../application/auth/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'EMPLOYER' | 'DOCTOR';
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      } else if (role !== allowedRole) {
        router.push('/jobs');
      }
    }
  }, [isAuthenticated, role, loading, allowedRole, router, pathname]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated || role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}

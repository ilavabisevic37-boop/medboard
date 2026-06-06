import React from 'react';
import { Box } from '@mui/material';
import AuthBrandPanel, { type AuthMode } from './AuthBrandPanel';

interface AuthLayoutProps {
  mode: AuthMode;
  children: React.ReactNode;
}

export default function AuthLayout({ mode, children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#ffffff',
      }}
    >
      {/* Left Column: Brand Panel (Hidden on mobile/tablet, visible on desktop) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '40%' },
          flexShrink: 0,
        }}
      >
        <AuthBrandPanel mode={mode} />
      </Box>

      {/* Right Column: form container (takes full width on mobile/tablet) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: '60%' },
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: '24px', sm: '48px', lg: '64px' },
          bgcolor: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '420px',
            bgcolor: '#ffffff',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

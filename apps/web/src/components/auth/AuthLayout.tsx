import React from 'react';
import { Box } from '@mui/material';
import AuthBrandPanel from './AuthBrandPanel';
import AuthFormContainer from './AuthFormContainer';

export default function AuthLayout() {
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
        <AuthBrandPanel />
      </Box>

      {/* Right Column: Sign In Form Container (Takes full width on mobile/tablet) */}
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
            maxWidth: '380px',
            bgcolor: '#ffffff',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <AuthFormContainer />
        </Box>
      </Box>
    </Box>
  );
}

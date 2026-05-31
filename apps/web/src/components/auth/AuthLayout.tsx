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
          width: { md: '45%', lg: '42%' },
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
          width: { xs: '100%', md: '55%', lg: '58%' },
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: '24px', sm: '48px' },
          bgcolor: '#F7F9FB', // Subtle elegant light grey background wrapper
        }}
      >
        {/* White inner wrapper for form container to pop out */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '520px',
            bgcolor: '#ffffff',
            borderRadius: { xs: '0px', sm: '24px' },
            boxShadow: { xs: 'none', sm: '0px 10px 40px rgba(0, 0, 0, 0.03)' },
            p: { xs: '20px 0px', sm: '48px 48px' },
            border: { xs: 'none', sm: '1px solid #EAEFFF' },
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

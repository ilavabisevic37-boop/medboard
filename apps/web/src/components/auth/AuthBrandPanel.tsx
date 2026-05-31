import React from 'react';
import { Box, Typography } from '@mui/material';
import HeroCards from './HeroCards';
import TrustBadge from './TrustBadge';

export default function AuthBrandPanel() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #1B2B5E 0%, #0F1A3A 100%)',
        color: '#ffffff',
        p: { xs: '40px', md: '48px 56px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Blur Circles (Top Right glowing effects) */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91, 123, 232, 0.18) 0%, rgba(91, 123, 232, 0) 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '-20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91, 123, 232, 0.12) 0%, rgba(91, 123, 232, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Content (Z-Index ensure it is on top of circles) */}
      <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flexGrow: 1 }}>
        {/* Top: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Logo Cross Icon Container */}
          <Box
            sx={{
              width: '28px',
              height: '28px',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.5V10.5M1.5 6H10.5"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </Box>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            Medboard
          </Typography>
        </Box>

        {/* Center Section: Headline, description and cards */}
        <Box sx={{ my: 'auto', py: '40px' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '28px', md: '32px' },
              fontWeight: 800,
              lineHeight: 1.25,
              maxWidth: '280px',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back to Medboard.
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: '280px',
              mt: '16px',
              mb: '28px',
            }}
          >
            Pick up right where you left off — your matches, messages, and applications are waiting.
          </Typography>

          <HeroCards />
        </Box>

        {/* Bottom: Trustbadge */}
        <TrustBadge />
      </Box>
    </Box>
  );
}

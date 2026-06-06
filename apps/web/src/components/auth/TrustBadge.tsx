import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TrustBadge() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'rgba(255, 255, 255, 0.6)',
        mt: 'auto',
      }}
    >
      {/* Custom checkmark shield SVG for premium design */}
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M8 0.5L1.5 3V8C1.5 12.3 4.28 16.3 8 17.5C11.72 16.3 14.5 12.3 14.5 8V3L8 0.5Z"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 8.5L7.16667 10L10.5 6"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Typography
        variant="body2"
        sx={{
          fontSize: '12px',
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}
      >
        Credentials verified - HIPAA-aware
      </Typography>
    </Box>
  );
}

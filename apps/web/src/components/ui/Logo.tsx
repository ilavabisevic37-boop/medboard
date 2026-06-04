import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface LogoProps {
  size?: number;
  light?: boolean;
  withText?: boolean;
}

export function Logo({ size = 26, light = false, withText = true }: LogoProps) {
  const ink = light ? '#fff' : '#1D3461';
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        textDecoration: 'none',
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: `${size * 0.3}px`,
          background: light ? 'rgba(255,255,255,0.16)' : '#2B4C7E',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: light
            ? 'none'
            : '0 1px 2px rgba(30,50,80,0.06), 0 1px 3px rgba(30,50,80,0.05)',
        }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4Z" fill="#fff" />
        </svg>
      </Box>
      {withText && (
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            fontSize: size * 0.7,
            letterSpacing: '-0.03em',
            color: ink,
            lineHeight: 1,
          }}
        >
          Medboard
        </Typography>
      )}
    </Box>
  );
}

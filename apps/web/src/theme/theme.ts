'use client';

import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

import { inter } from './font';

const customShadows: Shadows = [
  'none',
  '0 1px 2px rgba(30,50,80,0.06), 0 1px 3px rgba(30,50,80,0.05)',
  '0 2px 6px rgba(30,50,80,0.06), 0 8px 24px rgba(30,50,80,0.06)',
  '0 4px 12px rgba(30,50,80,0.08), 0 1px 3px rgba(30,50,80,0.04)',
  '0 12px 40px rgba(27,52,97,0.12), 0 2px 8px rgba(27,52,97,0.06)',
  ...Array(20).fill('0 2px 4px rgba(0,0,0,0.1)'),
] as Shadows;

/**
 * MedBoard design system — deep-blue medical marketplace.
 *
 * Palette derived from the design prototype oklch scale:
 *   brand-600 ≈ #2B4C7E  (primary)
 *   brand-700 ≈ #1D3461  (primary dark / accent-strong)
 *   brand-50  ≈ #EDF2F9   (accent tint)
 *   brand-100 ≈ #D8E4F0  (accent tint 2)
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2B4C7E',
      dark: '#1D3461',
      light: '#3E6BAF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1D3461',
      dark: '#142543',
      light: '#2B4C7E',
    },
    background: {
      default: '#F6F8FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E2A3A',
      secondary: '#556A82',
    },
    success: {
      main: '#2E8B57',
      light: '#E8F5E9',
    },
    warning: {
      main: '#C8A02B',
      light: '#FFF8E1',
    },
    error: {
      main: '#C45C3A',
      light: '#FBE9E7',
    },
    divider: '#E2E8F0',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05 },
    h2: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h3: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15 },
    h4: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h5: { fontWeight: 750, letterSpacing: '-0.015em' },
    h6: { fontWeight: 750, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 650, fontSize: '1rem' },
    subtitle2: { fontWeight: 650, fontSize: '0.875rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.55 },
    button: { fontWeight: 650, textTransform: 'none' as const },
  },
  shadows: customShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '10px 20px',
          fontWeight: 650,
          fontSize: '0.9375rem',
        },
        sizeLarge: {
          padding: '14px 26px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '7px 14px',
          fontSize: '0.8125rem',
        },
        contained: {
          boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 1px 2px rgba(30,50,80,0.06), 0 1px 3px rgba(30,50,80,0.05)',
        },
        outlined: {
          borderColor: '#E2E8F0',
          '&:hover': {
            borderColor: '#A0AEC0',
            backgroundColor: '#F6F8FB',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(30,50,80,0.06), 0 1px 3px rgba(30,50,80,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 650,
          fontSize: '0.8125rem',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

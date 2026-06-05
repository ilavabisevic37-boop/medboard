"use client";

import { createTheme } from '@mui/material/styles';
import { roboto } from './theme';

declare module '@mui/material/styles' {
  interface ThemeOptions {
    cssVariables?: boolean;
  }
}

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#4A7FD4',
      dark: '#3264B4',
      light: '#EAF3FC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1B2B5E',
      dark: '#0F1A3A',
      contrastText: '#ffffff',
    },
    success: { main: '#10B981', dark: '#047857', light: '#ECFDF5' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#4B5563' },
    divider: '#E5E7EB',
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: roboto.style.fontFamily },
});

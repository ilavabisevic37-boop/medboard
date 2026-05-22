'use client';

import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: { main: '#0D7C66' }, // medical green
    secondary: { main: '#1B6CA8' },
    background: { default: '#F7F9FB' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: roboto.style.fontFamily },
});

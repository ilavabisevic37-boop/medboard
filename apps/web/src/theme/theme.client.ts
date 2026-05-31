"use client";

import { createTheme } from '@mui/material/styles';
import { roboto } from './theme';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0D7C66' }, // medical green
    secondary: { main: '#1B6CA8' },
    background: { default: '#F7F9FB' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: roboto.style.fontFamily },
});

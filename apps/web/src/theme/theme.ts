'use client';

import { createTheme } from '@mui/material/styles';

import { roboto } from './font';

export const theme = createTheme({
  // NOTE: `cssVariables: true` requires MUI v6; this project is on v5.16.
  // Re-enable after upgrading @mui/material, or use experimental_extendTheme.
  palette: {
    mode: 'light',
    primary: { main: '#0D7C66' }, // medical green
    secondary: { main: '#1B6CA8' },
    background: { default: '#F7F9FB' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: roboto.style.fontFamily },
});

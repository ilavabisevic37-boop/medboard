import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Metadata } from 'next';

import { roboto } from '../theme/font';
import { theme } from '../theme/theme';

export const metadata: Metadata = {
  title: 'MedBoard — medical jobs',
  description: 'Find medical jobs and hire medical professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={roboto.className}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

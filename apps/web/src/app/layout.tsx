import type { Metadata } from 'next';

import { inter } from '../theme/font';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'MedBoard - medical jobs',
  description: 'Find medical jobs and hire medical professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.className}>
      <body style={{ margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

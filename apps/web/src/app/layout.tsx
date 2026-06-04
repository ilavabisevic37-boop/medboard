import type { Metadata } from 'next';

import { roboto } from '../theme/fonts';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'MedBoard — medical jobs',
  description: 'Find medical jobs and hire medical professionals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={roboto.className}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

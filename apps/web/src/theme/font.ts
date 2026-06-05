import { Inter } from 'next/font/google';

// Server-safe module (no 'use client'): next/font must be evaluated outside the
// client boundary so both the server layout and the client theme can share it
// without breaking the React Client Manifest.
export const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

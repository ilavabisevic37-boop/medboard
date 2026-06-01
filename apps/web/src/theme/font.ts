import { Roboto } from 'next/font/google';

// Server-safe module (no 'use client'): next/font must be evaluated outside the
// client boundary so both the server layout and the client theme can share it
// without breaking the React Client Manifest.
export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

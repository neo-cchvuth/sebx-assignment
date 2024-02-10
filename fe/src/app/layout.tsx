import StoreProvider from '@/redux/store-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Init from './_components/init';

import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEBx',
  description: 'Assignment',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Init />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

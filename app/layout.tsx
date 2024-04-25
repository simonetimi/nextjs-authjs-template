import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import Header from '@/components/ui/Header';
import { Toaster } from '@/components/ui/sonner';

import { Providers } from './providers';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '800'],
});

export const metadata: Metadata = {
  title: 'Next.js Template with Auth.js',
  description:
    'Template with authentication supporting multiple providers and Prisma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} scroll-smooth bg-background bg-gradient-to-b from-slate-50 to-slate-200 text-foreground dark:bg-gradient-to-b dark:from-gray-600/40 dark:to-gray-700/60`}
      >
        <Providers>
          <Header />
          <Toaster richColors position="top-center" />
          <main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center py-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

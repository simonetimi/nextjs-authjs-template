import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { auth } from '@/auth';

export async function Providers({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}

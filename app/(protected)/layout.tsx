import { SessionProvider } from 'next-auth/react';

import { Navbar } from '@/app/(protected)/_components/Navbar';
import { auth } from '@/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <main className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 py-10">
        <Navbar />
        {children}
      </main>
    </SessionProvider>
  );
}

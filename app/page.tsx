import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/LoginButton';

const font = Poppins({ subsets: ['latin'], weight: '600' });

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-slate-300 to-slate-500">
      <div className="flex flex-col gap-6 text-center">
        <h1
          className={cn(
            'text-6xl font-semibold text-white drop-shadow-md',
            font.className,
          )}
        >
          Auth 🔑
        </h1>
        <p className="text-white">Auth service</p>
        <LoginButton>
          <Button variant="secondary" size="lg">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}

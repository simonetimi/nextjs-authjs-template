'use client';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { DEFAULT_LOGGED_IN_REDIRECT } from '@/routes';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const onClick = (provider: string) => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGGED_IN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="bordered"
        onClick={() => onClick('google')}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="bordered"
        onClick={() => onClick('github')}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

'use client';
import { useEffect, useState, useTransition } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  Spinner,
} from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '@/actions/login';
import { Social } from '@/components/auth/Social';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with a different provider!'
      : '';
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    code: '',
  });

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      (async () => {
        try {
          const response = await login(loginForm, callbackUrl);
          if (response?.error) {
            setLoginForm({ email: '', password: '', code: '' });
            toast.error(response?.error);
          }
          if (response?.twoFactor) {
            setShowTwoFactor(true);
          }
        } catch {
          toast.error('Something went wrong!');
        }
      })();
    });
  };

  return (
    <Card className="h-full w-full p-6">
      <CardHeader className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Welcome back 👋</h1>
        {showTwoFactor && (
          <h2 className="text-sm">Check your email and enter the 2FA code</h2>
        )}
      </CardHeader>
      <CardBody>
        {showTwoFactor ? (
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-col items-center gap-4"
          >
            <Input
              type="tel"
              variant="flat"
              labelPlacement="inside"
              isInvalid={false}
              errorMessage="Please enter a valid code"
              className="max-w-xs"
              disabled={isPending}
              value={loginForm.code}
              onValueChange={(value) =>
                setLoginForm({ ...loginForm, code: value })
              }
            />
            <Button
              color="primary"
              className="mt-2 h-11 w-full rounded-lg"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <Spinner color="default" size="sm" /> : 'Enter code'}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-col items-center gap-2"
          >
            <Input
              type="email"
              label="Email"
              variant="flat"
              labelPlacement="inside"
              errorMessage="Please enter a valid email"
              className="max-w-xs"
              disabled={isPending}
              value={loginForm.email}
              isRequired
              onValueChange={(value) =>
                setLoginForm({ ...loginForm, email: value })
              }
            />
            <Input
              type="password"
              label="Password"
              variant="flat"
              labelPlacement="inside"
              className="max-w-xs"
              disabled={isPending}
              value={loginForm.password}
              isRequired
              onValueChange={(value) =>
                setLoginForm({ ...loginForm, password: value })
              }
            />
            <Link
              color="foreground"
              href="/auth/request-password-reset"
              underline="always"
              className="self-end text-xs"
            >
              Forgot your password?
            </Link>
            <Button
              color="primary"
              className="mt-2 h-11 w-full rounded-lg"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <Spinner color="default" size="sm" /> : 'Log in'}
            </Button>
          </form>
        )}
      </CardBody>
      <CardFooter className="flex flex-col items-center justify-center gap-4">
        <Social />
        <Link
          color="foreground"
          href="/auth/signup"
          underline="always"
          size="sm"
        >
          Don&apos;t have an account?
        </Link>
      </CardFooter>
    </Card>
  );
};

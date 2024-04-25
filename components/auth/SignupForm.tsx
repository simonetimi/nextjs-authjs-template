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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signup } from '@/actions/signup';
import { Social } from '@/components/auth/Social';

export const SignupForm = () => {
  const router = useRouter();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      return;
    }
    startTransition(() => {
      (async () => {
        const response = await signup(signupForm);
        if (response?.error) {
          toast.error(response?.error);
        } else if (response?.success) {
          toast.success(response?.success);
          setTimeout(() => router.push('/auth/login'), 3000);
        }
      })();
    });
  };

  // check if password and confirm password match
  useEffect(() => {
    if (signupForm.confirmPassword === '') {
      return;
    }
    setPasswordsMatch(signupForm.password === signupForm.confirmPassword);
  }, [signupForm.password, signupForm.confirmPassword]);

  // workaround for client-side password check (pattern attribute does not work)
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  useEffect(() => {
    if (signupForm.password === '') {
      setIsPasswordValid(true);
      return;
    }
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])');
    if (!passwordRegex.test(signupForm.password)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
      setIsPasswordValid(false);
    } else {
      setPasswordError('');
      setIsPasswordValid(true);
    }
  }, [signupForm.password]);

  return (
    <Card className="h-full w-full p-6">
      <CardHeader className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Sign up here!</h1>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-center gap-4"
        >
          <Input
            type="text"
            label="Name"
            variant="flat"
            labelPlacement="inside"
            minLength={2}
            maxLength={50}
            className="max-w-xs"
            disabled={isPending}
            value={signupForm.name}
            isRequired
            onValueChange={(value) =>
              setSignupForm({ ...signupForm, name: value })
            }
          />
          <Input
            type="email"
            label="Email"
            variant="flat"
            labelPlacement="inside"
            errorMessage="Please enter a valid email"
            minLength={4}
            maxLength={254}
            className="max-w-xs"
            disabled={isPending}
            value={signupForm.email}
            isRequired
            onValueChange={(value) =>
              setSignupForm({ ...signupForm, email: value })
            }
          />
          <Input
            type="password"
            label="Password"
            variant="flat"
            labelPlacement="inside"
            minLength={6}
            maxLength={254}
            isInvalid={!isPasswordValid}
            errorMessage={passwordError}
            className="max-w-xs"
            disabled={isPending}
            value={signupForm.password}
            isRequired
            onValueChange={(value) =>
              setSignupForm({ ...signupForm, password: value })
            }
          />
          <Input
            type="password"
            label="Confirm password"
            variant="flat"
            labelPlacement="inside"
            minLength={6}
            maxLength={254}
            className="max-w-xs"
            disabled={isPending}
            isInvalid={!passwordsMatch}
            errorMessage="Passwords don't match!"
            value={signupForm.confirmPassword}
            isRequired
            onValueChange={(value) =>
              setSignupForm({ ...signupForm, confirmPassword: value })
            }
          />
          <Button
            color="primary"
            className="mt-2 h-11 w-full rounded-lg"
            disabled={isPending}
            type="submit"
          >
            {isPending ? <Spinner color="default" size="sm" /> : 'Sign up'}
          </Button>
        </form>
      </CardBody>
      <CardFooter className="flex flex-col items-center justify-center gap-4">
        <Social />
        <Link
          color="foreground"
          href="/auth/login"
          underline="always"
          size="sm"
        >
          Already have an account?
        </Link>
      </CardFooter>
    </Card>
  );
};

'use client';

import { useEffect, useState, useTransition } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { passwordReset } from '@/actions/passwordReset';

export const PasswordResetForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [passwordResetForm, setPasswordResetForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordResetForm.password !== passwordResetForm.confirmPassword) {
      return;
    }
    startTransition(() => {
      (async () => {
        if (!token) {
          toast.error('Invalid link! Retry or request a new one');
          return;
        }
        const response = await passwordReset(
          { password: passwordResetForm.password },
          token,
        );
        if (response?.error) {
          toast.error(response?.error);
        } else if (response?.success) {
          toast.success(response?.success);
          setSuccess(true);
          setTimeout(() => router.push('/auth/login'), 5000);
        }
      })();
    });
  };

  // check if password and confirm password match
  useEffect(() => {
    if (passwordResetForm.confirmPassword === '') {
      return;
    }
    setPasswordsMatch(
      passwordResetForm.password === passwordResetForm.confirmPassword,
    );
  }, [passwordResetForm.password, passwordResetForm.confirmPassword]);

  // workaround for client-side password check (pattern attribute does not work)
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  useEffect(() => {
    if (passwordResetForm.password === '') {
      setIsPasswordValid(true);
      return;
    }
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])');
    if (!passwordRegex.test(passwordResetForm.password)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
      setIsPasswordValid(false);
    } else {
      setPasswordError('');
      setIsPasswordValid(true);
    }
  }, [passwordResetForm.password]);

  return (
    <Card className="h-full w-full p-6">
      <CardHeader className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Reset your password</h1>
      </CardHeader>
      {!success ? (
        <CardBody>
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-col items-center gap-4"
          >
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
              value={passwordResetForm.password}
              isRequired
              onValueChange={(value) =>
                setPasswordResetForm({ ...passwordResetForm, password: value })
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
              value={passwordResetForm.confirmPassword}
              isRequired
              onValueChange={(value) =>
                setPasswordResetForm({
                  ...passwordResetForm,
                  confirmPassword: value,
                })
              }
            />
            <Button
              color="primary"
              className="mt-2 h-11 w-full rounded-lg"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <Spinner color="default" size="sm" />
              ) : (
                'Set new password'
              )}
            </Button>
          </form>
        </CardBody>
      ) : (
        <CardBody className="flex flex-col items-center gap-2">
          <CheckCircleIcon className="text-success w-10" />
          <p>Your new password has been set!</p>
          <p>Redirecting...</p>
        </CardBody>
      )}
      <CardFooter className="flex flex-col items-center justify-center gap-4">
        <Link
          color="foreground"
          href="/auth/login"
          underline="always"
          size="sm"
        >
          Go back to login
        </Link>
      </CardFooter>
    </Card>
  );
};

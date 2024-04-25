'use client';

import { useState, useTransition } from 'react';
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
import { toast } from 'sonner';

import { requestPasswordReset } from '@/actions/requestPasswordReset';

export const RequestPasswordResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      (async () => {
        try {
          const response = await requestPasswordReset({ email: email });
          if (response?.error) {
            setEmail('');
            toast.error(response?.error);
          }
          if (response?.success) {
            toast.success(response?.success);
            setSuccess(true);
          }
        } catch {
          toast.error('Something went wrong!');
        }
      })();
    });
  };

  return (
    <Card className="h-full w-full p-6">
      {!success ? (
        <>
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Request password reset</h1>
          </CardHeader>
          <CardBody>
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
                value={email}
                isRequired
                onValueChange={(value) => setEmail(value)}
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
                  'Request password reset'
                )}
              </Button>
            </form>
          </CardBody>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Password reset link sent!</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-2">
            <CheckCircleIcon className="text-success w-10" />
            <p>Check your email for the password reset link</p>
          </CardBody>
        </>
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

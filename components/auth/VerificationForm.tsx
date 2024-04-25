'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { CardFooter, CircularProgress, Link } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { emailVerification } from '@/actions/emailVerification';

export const VerificationForm = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(async () => {
    if (!token) {
      toast.error('Token is missing!');
      return;
    }
    const response = await emailVerification(token);
    if (response.error) {
      setError(true);
      toast.error(response.error);
    } else if (response.success) {
      setSuccess(true);
      toast.success(response.success);
      setTimeout(() => router.push('auth/login'), 5000);
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="h-full w-full p-6">
      {!error && !success && (
        <>
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Verifying your email</h1>
          </CardHeader>
          <CardBody className="flex items-center">
            <CircularProgress />
          </CardBody>
        </>
      )}
      {error && (
        <>
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Error verifying your email!</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-2">
            <ExclamationCircleIcon className="text-danger w-10" />
            <p>
              Update the page or attempt a login to get a new verification link.
            </p>
          </CardBody>
          <CardFooter className="flex items-center justify-center">
            <Link
              color="foreground"
              href="/auth/login"
              underline="always"
              size="sm"
            >
              Go back to login
            </Link>
          </CardFooter>
        </>
      )}
      {success && (
        <>
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl">Email verified correctly!</h1>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-2">
            <CheckCircleIcon className="text-success w-10" />
            <p>Redirecting...</p>
          </CardBody>
          <CardFooter className="flex items-center justify-center">
            <Link
              color="foreground"
              href="/auth/login"
              underline="always"
              size="sm"
            >
              Go to login if redirecting is taking too long
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

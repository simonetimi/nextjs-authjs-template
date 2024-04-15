'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as z from 'zod';

import { login } from '@/actions/login';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginSchema } from '@/schemas';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      (async () => {
        try {
          const response = await login(values);
          if (response?.error) {
            form.reset();
            setError(response?.error);
          } else if (response?.success) {
            form.reset();
            setSuccess(response?.success);
          }
          if (response?.twoFactor) {
            setShowTwoFactor(true);
          }
        } catch {
          setError('Something went wrong!');
        }
      })();
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/signup"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {!showTwoFactor ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="yourname@email.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your password"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 font-normal"
                        asChild
                      >
                        <Link href="/auth/request-password-reset">
                          Forgot password?
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </>
            ) : (
              <>
                <FormField
                  key="two-factor-code"
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2FA Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter code"
                          type="tel"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 font-normal"
                        asChild
                      ></Button>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? 'Confirm code' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

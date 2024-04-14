'use server';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGGED_IN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  // check if user exists. if user has no password, it means the signup was made through a provider
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'User does not exist!' };
  }

  // check if user is verified
  if (!existingUser.emailVerified) {
    // check when last token was created. if less than 3 minutes, return error
    const verificationToken = await getVerificationTokenByEmail(
      existingUser.email,
    );
    const now = new Date();
    const THREE_MINUTES_IN_MS = 180000;
    const ONE_HOUR_IN_MS = 3600000;
    if (
      Number(now) - Number(verificationToken?.expires) + ONE_HOUR_IN_MS <
      THREE_MINUTES_IN_MS
    ) {
      return {
        error: 'A verification email has been already requested!',
      };
    }

    // create and send new verification token
    const newVerificationToken = await generateVerificationToken(
      existingUser.email,
    );

    // send email
    await sendVerificationEmail(
      newVerificationToken.email,
      newVerificationToken.token,
    );

    return {
      success: 'A new verification email has been sent!',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGGED_IN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Wrong username or password!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    throw error;
  }
};

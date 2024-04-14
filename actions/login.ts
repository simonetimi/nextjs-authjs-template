'use server';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
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
    await generateVerificationToken(existingUser.email);
    return { success: 'Verification email has been re-sent!' };
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
          return { error: error.message };
      }
    }
    throw error;
  }
};

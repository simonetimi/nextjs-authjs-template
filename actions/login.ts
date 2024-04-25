'use server';

import { compare } from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/data/twoFactorConfirmation';
import { getTwoFactorTokenByEmail } from '@/data/twoFactorToken';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { prisma } from '@/lib/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { DEFAULT_LOGGED_IN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  // check if user exists. if user has no password, it means the signup was made through a provider
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'User does not exist!' };
  }

  // check if the provided password matches the one in the database
  if (existingUser.password) {
    const isPasswordMatch = await compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return { error: 'Wrong password!' };
    }
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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // if user inserted a 2FA code, check for validity
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: 'Invalid code!' };
      }
      if (twoFactorToken.token !== code) {
        return { error: 'Wrong code!' };
      }
      if (new Date(twoFactorToken.expires) < new Date()) {
        return { error: 'Code expired! Request a new one' };
      }
      // validity check passed, delete the token (code)
      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );
      // set confirmation okay
      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // if there's no code, send code by email
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGGED_IN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Login failed. Wrong credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    throw error;
  }
};

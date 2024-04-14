'use server';
import * as z from 'zod';

import { getPasswordResetTokenByEmail } from '@/data/passwordResetToken';
import { getUserByEmail } from '@/data/user';
import { sentPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { RequestPasswordResetSchema } from '@/schemas';

export const requestPasswordReset = async (
  values: z.infer<typeof RequestPasswordResetSchema>,
) => {
  const validatedFields = RequestPasswordResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  // check if user exists. if user has no password, it means the signup was made through a provider
  if (!existingUser || !existingUser.password) {
    return { error: 'User does not exist!' };
  }

  // check if there's a request-password-reset token
  const verificationToken = await getPasswordResetTokenByEmail(
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
      error: 'A password reset link has been already requested!',
    };
  }

  const newPasswordResetToken = await generatePasswordResetToken(
    existingUser.email,
  );

  await sentPasswordResetEmail(
    newPasswordResetToken.email,
    newPasswordResetToken.token,
  );

  return {
    success: 'A reset link has been sent!',
  };
};

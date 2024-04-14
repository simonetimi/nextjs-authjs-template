'use server';

import { hash } from 'bcryptjs';
import * as z from 'zod';

import { getPasswordResetTokenByToken } from '@/data/passwordResetToken';
import { getUserByEmail } from '@/data/user';
import { prisma } from '@/lib/db';
import { PasswordResetSchema } from '@/schemas';

export const passwordReset = async (
  values: z.infer<typeof PasswordResetSchema>,
  token: string,
) => {
  const validatedFields = PasswordResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { password } = validatedFields.data;

  //check if token exists
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const now = new Date();

  //check if token has expired
  const hasExpired = new Date(existingToken.expires) < now;
  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  // check if user exists
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: 'Email does not exist' };
  }

  // TODO hash and bcryptjs
  const hashedPassword = await hash(password, 12);

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Password has been updated!' };
};

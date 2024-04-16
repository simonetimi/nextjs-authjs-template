'use server';

import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { SettingsSchema } from '@/schemas';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  const databaseUser = await getUserById(user.id);
  if (!databaseUser) {
    return { error: 'Unauthorized' };
  }

  // if user is OAuth, these fields can't be modified
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // update email (sending verification email) only if email isn't already in use
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(values.email, verificationToken.token);
    return { success: 'Verification email sent!' };
  }

  if (values.password && values.newPassword && databaseUser.password) {
    const passwordMatch = await compare(values.password, databaseUser.password);
    if (!passwordMatch) {
      return { error: 'Incorrect password!' };
    }
    values.password = await hash(values.password, 12);
    // new password does not exist in database, so set it undefined
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: {
      id: databaseUser.id,
    },
    data: {
      ...values,
    },
  });
  return { success: 'Settings updated!' };
};

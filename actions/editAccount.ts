'use server';

import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { EditAccountSchema } from '@/schemas';

export const editAccount = async (
  values: z.infer<typeof EditAccountSchema>,
) => {
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

  if (values.password === '') {
    values.password = undefined;
  }

  if (values.newPassword === '') {
    values.newPassword = undefined;
  }

  const validatedFields = EditAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const validatedData = validatedFields.data;

  // update email (sending verification email) only if email isn't already in use
  if (validatedData.email && validatedData.email !== user.email) {
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }
    const verificationToken = await generateVerificationToken(
      validatedData.email,
    );
    await sendVerificationEmail(validatedData.email, verificationToken.token);
    await prisma.user.update({
      where: {
        id: databaseUser.id,
      },
      data: {
        newEmail: validatedData.email,
      },
    });
    return { success: 'Verification email sent!' };
  }

  if (
    validatedData.password &&
    validatedData.newPassword &&
    databaseUser.password
  ) {
    const passwordMatch = await compare(
      validatedData.password,
      databaseUser.password,
    );
    if (!passwordMatch) {
      return { error: 'Incorrect password!' };
    }
    validatedData.password = await hash(validatedData.password, 12);
    // new password does not exist in database, so set it undefined
    validatedData.newPassword = undefined;
  }

  await prisma.user.update({
    where: {
      id: databaseUser.id,
    },
    data: {
      ...validatedData,
    },
  });
  return { success: 'Account settings updated!' };
};

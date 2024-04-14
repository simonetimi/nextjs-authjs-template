'use server';
import { hash } from 'bcryptjs';
import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { SignupSchema } from '@/schemas';

export const signup = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, password } = validatedFields.data;

  // check if user exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  // hash password
  const hashedPassword = await hash(password, 12);

  // create and save new user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // create verification token
  const verificationToken = await generateVerificationToken(email);

  // send email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Signed up! Check your email' };
};

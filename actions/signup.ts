'use server';
import { hash } from 'bcrypt';
import * as z from 'zod';

import { getUserByEmail } from '@/lib/data';
import { prisma } from '@/lib/db';
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

  // TODO: send verification email (token)

  return { success: 'Signed up!' };
};

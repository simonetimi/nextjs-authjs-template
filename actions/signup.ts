'use server';
import * as z from 'zod';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';
import { SignupSchema } from '@/schemas';

export const signup = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, password } = validatedFields.data;

  // check if user exists
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  // hash password
  const hashedPassword = await hash(password, 12);

  // create and save new user
  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: send verification email (token)

  return { success: 'Signed up!' };
};

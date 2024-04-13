'use server';
import * as z from 'zod';
import { SignupSchema } from '@/schemas';

export const signup = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields) {
    return { error: 'Invalid fields' };
  }

  return { success: 'Signed up!' };
};

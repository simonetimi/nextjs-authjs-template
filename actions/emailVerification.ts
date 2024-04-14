'use server';
import { getVerificationTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
import { prisma } from '@/lib/db';

export const emailVerification = async (token: string) => {
  // check if token exists in db
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const now = new Date();

  //check if token has expired
  const hasExpired = new Date(existingToken.expires) < now;
  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  // check if email has changed since the request
  const user = await getUserByEmail(existingToken.email);
  if (!user) {
    return { error: 'Email does not exist' };
  }

  // set user has verified
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: now,
      email: existingToken.email,
    },
  });

  // delete token from db
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return {
    success: 'Email has been verified correctly!',
  };
};

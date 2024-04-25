'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verificationToken';
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

  let user;

  // find if user has the newEmail field filled in. if it does, it proceeds to the verification
  user = await prisma.user.findFirst({
    where: {
      newEmail: existingToken.email,
    },
  });

  // if there is no newEmail field (so "user" is null), finds the user current email. if it can't find it, it simply returns
  if (!user) {
    user = await getUserByEmail(existingToken.email);
    if (!user) {
      return { error: 'Email does not exist' };
    }
  }

  // set user has verified
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: now,
      email: existingToken.email,
      newEmail: null,
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

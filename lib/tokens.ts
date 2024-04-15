import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { getPasswordResetTokenByEmail } from '@/data/passwordResetToken';
import { getTwoFactorTokenByEmail } from '@/data/twoFactorToken';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { prisma } from '@/lib/db';

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const now = new Date();
  const expires = new Date(now.setMinutes(now.getMinutes() + 10)); //10 minutes from now
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  return prisma.twoFactorToken.create({
    data: { email, token, expires },
  });
};

export const generateVerificationToken = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const token = uuidv4();
  const now = new Date();
  const expires = new Date(now.setHours(now.getHours() + 3)); //3 hours from now

  return prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const generatePasswordResetToken = async (email: string) => {
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const token = uuidv4();
  const now = new Date();
  const expires = new Date(now.setHours(now.getHours() + 1)); //1 hour from now

  return prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

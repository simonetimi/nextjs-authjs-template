import { v4 as uuidv4 } from 'uuid';

import {
  getPasswordResetTokenByEmail,
  getPasswordResetTokenByToken,
} from '@/data/passwordResetToken';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { prisma } from '@/lib/db';

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
  const expires = new Date(now.setHours(now.getHours() + 1)); //1 hour from now

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

import { prisma } from '@/lib/db';

export const getPasswordResetTokenByToken = (token: string) => {
  try {
    return prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = (email: string) => {
  try {
    return prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
};

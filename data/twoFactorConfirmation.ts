import { prisma } from '@/lib/db';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    return await prisma.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });
  } catch {
    return null;
  }
};

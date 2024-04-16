import { prisma } from '@/lib/db';

export const getAccountByUserId = async (userId: string) => {
  return prisma.account.findFirst({
    where: {
      id: userId,
    },
  });
};

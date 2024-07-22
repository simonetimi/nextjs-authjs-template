import { PrismaClient } from '@prisma/client';

declare global {
  // var is necessary for writing a property on the global object
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// avoids creating a new prisma client every time Next.js uses hot reload
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

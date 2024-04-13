import { PrismaClient } from '@prisma/client';

// var is necessary for writing a property on the global object
declare global {
  var prisma: PrismaClient | undefined;
}

// avoids creating a new prisma client every time Next.js uses hot reaload
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

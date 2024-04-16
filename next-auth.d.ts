import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

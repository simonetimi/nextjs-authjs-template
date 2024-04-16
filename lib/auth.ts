import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';

export const currentUser = async () => {
  const session = await auth();
  // invalidate cache so the server component is updated
  revalidatePath('/server');
  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user.role;
};

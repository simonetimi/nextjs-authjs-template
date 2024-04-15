'use client';

import { signOut } from 'next-auth/react';

import { useCurrentUser } from '@/hooks/useCurrentUser';

const SettingsPage = () => {
  const user = useCurrentUser();
  const onClick = () => {
    signOut();
  };

  return (
    <div className="rounded-xl bg-white p-10">
      <button onClick={onClick}>Sign out</button>
    </div>
  );
};

export default SettingsPage;

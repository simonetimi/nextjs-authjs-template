import { auth } from '@/auth';

const SettingsPage = async () => {
  const session = await auth();
  return <p>{JSON.stringify(session)}</p>;
};

export default SettingsPage;

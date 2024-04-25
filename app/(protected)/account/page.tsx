import { EditAccountForm } from '@/components/auth/EditAccountForm';
import { currentUser } from '@/lib/auth';

const AccountPage = async () => {
  const user = await currentUser();
  if (user) {
    return <EditAccountForm user={user} />;
  }
};

export default AccountPage;

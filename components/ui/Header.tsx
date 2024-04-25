import { Link } from '@nextui-org/react';

import { auth } from '@/auth';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import UserMenu from '@/components/ui/UserMenu';

const Header = async () => {
  const session = await auth();

  const user = session?.user;

  return (
    <header
      className="sticky top-0 z-40 flex h-20 w-screen items-center border-b-1 border-gray-300 bg-white/20 p-6 backdrop-blur-md dark:border-white/20
         dark:bg-gray-800/10 dark:backdrop-blur"
    >
      <Link color="foreground" href="/" className="flex gap-2">
        <h1 className="text-3xl">Home page</h1>
      </Link>
      <div className="ml-auto flex gap-4">
        <ThemeSwitcher className=" mt-1" />
        {!user && <UserMenu />}
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
};

export default Header;

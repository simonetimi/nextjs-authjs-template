'use client';

import {
  ArrowLeftStartOnRectangleIcon,
  CogIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

import { LoginButton } from '@/components/auth/LoginButton';

const UserMenu = ({ user }: { user?: User }) => {
  if (!user) {
    return (
      <nav className="ml-auto">
        <LoginButton mode="modal" />
      </nav>
    );
  }

  const handleLogout = () => {
    signOut();
  };
  const { id, name, image } = user;

  return (
    <nav className="ml-auto">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            showFallback
            className="transition-transform"
            name={name || ''}
            src={image || ''}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" disabledKeys={['preview']}>
          <DropdownItem
            key="preview"
            textValue="Signed in"
            className="opacity-100"
          >
            <p className="font-semibold">Hi, {name}</p>
          </DropdownItem>
          <DropdownSection aria-label="Manage Account" showDivider>
            <DropdownItem key="profile" href={`/user/${id}`}>
              <div className="flex items-center">
                <UserCircleIcon className="mr-1 h-6 w-6" />
                <p>Profile</p>
              </div>
            </DropdownItem>
            <DropdownItem key="account" href="/account">
              <div className="flex items-center">
                <CogIcon className="mr-1 h-6 w-6" />
                <p>My Account</p>
              </div>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection aria-label="Danger Zone">
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              <div className="flex items-center">
                <ArrowLeftStartOnRectangleIcon className="mr-1 h-6 w-6" />
                <p>Log Out</p>
              </div>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </nav>
  );
};

export default UserMenu;

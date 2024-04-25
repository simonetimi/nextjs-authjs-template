'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import { LoginForm } from '@/components/auth/LoginForm';

interface LoginButtonProps {
  children?: React.ReactNode;
  mode?: 'modal' | 'redirect';
}

export const LoginButton = ({
  children,
  mode = 'redirect',
}: LoginButtonProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return (
      <>
        <Button className="w-24" onPress={onOpen} color="primary">
          Sign in
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="w-3/4 md:w-[380px]"
          classNames={{
            body: 'm-0 p-0',
          }}
        >
          <ModalContent>
            <ModalBody>
              <LoginForm />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return <button onClick={onClick}>{children}</button>;
};

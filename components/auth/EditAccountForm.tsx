'use client';

import React, { useEffect, useState, useTransition } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spinner,
  Switch,
} from '@nextui-org/react';
import { toast } from 'sonner';

import { editAccount } from '@/actions/editAccount';
import { ExtendedUser } from '@/next-auth';

export const EditAccountForm = ({ user }: { user: ExtendedUser }) => {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editAccountForm, setEditAccountForm] = useState({
    name: user?.name,
    email: user?.email,
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    isTwoFactorEnabled: user?.isTwoFactorEnabled,
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editAccountForm.newPassword !== editAccountForm.confirmNewPassword) {
      return;
    }
    startTransition(() => {
      (async () => {
        const response = await editAccount(editAccountForm);
        if (response?.error) {
          toast.error(response?.error);
        } else if (response?.success) {
          toast.success(response?.success);
        }
        setEditAccountForm({
          ...editAccountForm,
          password: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      })();
    });
  };

  // check if password and confirm password match
  useEffect(() => {
    if (editAccountForm.confirmNewPassword === '') {
      return;
    }
    setPasswordsMatch(
      editAccountForm.newPassword === editAccountForm.confirmNewPassword,
    );
  }, [editAccountForm.newPassword, editAccountForm.confirmNewPassword]);

  // workaround for client-side password check (pattern attribute does not work)
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  useEffect(() => {
    if (editAccountForm.newPassword === '') {
      setIsPasswordValid(true);
      return;
    }
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])');
    if (
      editAccountForm.newPassword &&
      !passwordRegex.test(editAccountForm.newPassword)
    ) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      );
      setIsPasswordValid(false);
    } else {
      setPasswordError('');
      setIsPasswordValid(true);
    }
  }, [editAccountForm.newPassword]);

  return (
    <Card className="h-full w-full p-6">
      <CardHeader className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Edit account settings ⚙️</h1>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center gap-y-20">
        <form
          onSubmit={handleOnSubmit}
          className="flex w-4/5 flex-col items-center justify-center gap-4"
        >
          <Input
            type="text"
            label="Name"
            variant="flat"
            labelPlacement="inside"
            minLength={2}
            maxLength={50}
            className="max-w-xs"
            disabled={isPending}
            value={editAccountForm.name}
            isRequired
            onValueChange={(value) =>
              setEditAccountForm({ ...editAccountForm, name: value })
            }
          />
          <Divider className="my-4" />
          <Input
            type="email"
            label="Email"
            variant="flat"
            labelPlacement="inside"
            errorMessage="Please enter a valid email"
            minLength={4}
            maxLength={254}
            className="max-w-xs"
            disabled={isPending}
            value={editAccountForm.email}
            isRequired
            onValueChange={(value) =>
              setEditAccountForm({ ...editAccountForm, email: value })
            }
          />
          <Divider className="my-4" />
          <Accordion isCompact>
            <AccordionItem
              key="1"
              aria-label="Edit password"
              title="Edit password"
              classNames={{ content: 'flex flex-col gap-5' }}
            >
              <Input
                type="password"
                label="Current password"
                variant="flat"
                labelPlacement="inside"
                maxLength={254}
                className="max-w-xs"
                disabled={isPending}
                value={editAccountForm.password}
                onValueChange={(value) =>
                  setEditAccountForm({ ...editAccountForm, password: value })
                }
              />
              <Input
                type="password"
                label="New password"
                variant="flat"
                labelPlacement="inside"
                minLength={6}
                maxLength={254}
                className="max-w-xs"
                disabled={isPending}
                isInvalid={!isPasswordValid}
                errorMessage={passwordError}
                value={editAccountForm.newPassword}
                onValueChange={(value) =>
                  setEditAccountForm({ ...editAccountForm, newPassword: value })
                }
              />
              <Input
                type="password"
                label="Confirm new password"
                variant="flat"
                labelPlacement="inside"
                minLength={6}
                maxLength={254}
                className="max-w-xs"
                disabled={isPending}
                isInvalid={!passwordsMatch}
                errorMessage="Passwords don't match!"
                value={editAccountForm.confirmNewPassword}
                onValueChange={(value) =>
                  setEditAccountForm({
                    ...editAccountForm,
                    confirmNewPassword: value,
                  })
                }
              />
            </AccordionItem>
          </Accordion>
          <Divider className="my-4" />
          <Switch
            isSelected={editAccountForm.isTwoFactorEnabled}
            onValueChange={(value) =>
              setEditAccountForm({
                ...editAccountForm,
                isTwoFactorEnabled: value,
              })
            }
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Enable 2-Factor Authentication</p>
              <p className="text-tiny text-default-400">
                A code will be sent to your email address when you try to login.
              </p>
            </div>
          </Switch>
          <Button
            color="primary"
            className="mt-4 h-11 w-5/6 rounded-lg"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <Spinner color="default" size="sm" />
            ) : (
              'Edit settings'
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

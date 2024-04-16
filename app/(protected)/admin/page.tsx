'use client';

import { UserRole } from '@prisma/client';
import { toast } from 'sonner';

import { admin } from '@/actions/admin';
import { RoleGate } from '@/components/auth/RoleGate';
import { FormSuccess } from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCurrentRole } from '@/hooks/useCurrentRole';

const AdminPage = () => {
  const onServerActionClick = async () => {
    const data = await admin();
    if (data.error) {
      toast.error(data.error);
    }
    if (data.success) {
      toast.success(data.success);
    }
  };
  const role = useCurrentRole();
  return (
    <Card className="w-4/5 md:w-[600px]">
      <CardHeader>
        <p className="text-center text-xl font-semibold">Admin 🗂️</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="Authorized" />
        </RoleGate>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Admin-only server action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;

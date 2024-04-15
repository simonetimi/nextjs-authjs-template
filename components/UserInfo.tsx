import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExtendedUser } from '@/next-auth';

interface InfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: InfoProps) => {
  return (
    <Card className="w-4/5 shadow-md md:w-[600px]">
      <CardHeader>
        <p className="text-center text-xl font-semibold">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-small font-medium">ID</p>
          <p className="p- max-w-[180] truncate rounded-md bg-slate-100 font-mono text-xs">
            {user?.id}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-small font-medium">Name</p>
          <p className="p- max-w-[180] truncate rounded-md bg-slate-100 font-mono text-xs">
            {user?.name}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-small font-medium">Email</p>
          <p className="p- max-w-[180] truncate rounded-md bg-slate-100 font-mono text-xs">
            {user?.email}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-small font-medium">Role</p>
          <p className="p- max-w-[180] truncate rounded-md bg-slate-100 font-mono text-xs">
            {user?.role}
          </p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-small font-medium">2FA</p>
          <Badge variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}>
            {user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

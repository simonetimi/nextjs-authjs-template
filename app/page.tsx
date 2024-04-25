import { Card, CardBody, CardHeader } from '@nextui-org/card';

import { LoginButton } from '@/components/auth/LoginButton';

export default function Home() {
  return (
    <Card className="h-56 w-2/3 flex-col items-center justify-center gap-8 p-4 dark:border dark:border-neutral-800 md:w-[400px]">
      <CardHeader className="mt-4 justify-center">
        <h1 className="text-3xl font-semibold drop-shadow-md">Home Page 🏠</h1>
      </CardHeader>
      <CardBody className="items-center justify-center">
        <p>This is the home page</p>
      </CardBody>
    </Card>
  );
}

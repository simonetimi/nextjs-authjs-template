const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200">
      {children}
    </main>
  );
};

export default AuthLayout;

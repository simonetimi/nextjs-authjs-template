const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-slate-300 to-slate-500">
      {children}
    </div>
  );
};

export default AuthLayout;

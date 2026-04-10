import Link from "next/link";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">SP</div>
            <span className="text-2xl font-bold tracking-tight">Soft<span className="text-gradient">Path</span></span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

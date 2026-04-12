"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated" && !!session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={loggedIn ? "/dashboard" : "/"} className="flex items-center">
          <Image src="/GrantedPathLogo.png" alt="Granted Path" width={315} height={90} className="h-[90px] w-auto" priority />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {!loggedIn && navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
          ))}
          {loggedIn && (
            <>
              <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
              <Link href="/learn" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Learn</Link>
              <Link href="/ai-chat" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">AI Chat</Link>
            </>
          )}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                {session.user.image ? (
                  <Image src={session.user.image} alt="" width={24} height={24} className="h-6 w-6 rounded-full" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{session.user.name || session.user.email}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" />Sign Out
              </Button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"><Globe className="h-4 w-4" /><span>EN</span><ChevronDown className="h-3 w-3" /></button>
              <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link href="/register"><Button size="sm" className="glow-amber">Start Free</Button></Link>
            </>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mt-8 flex flex-col gap-4">
              {loggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {session.user.image ? (
                      <Image src={session.user.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"><User className="h-4 w-4 text-primary" /></div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="my-2 h-px bg-border" />
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                  <Link href="/learn" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground">Learn</Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground">Settings</Link>
                  <div className="my-2 h-px bg-border" />
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}><LogOut className="mr-2 h-4 w-4" />Sign Out</Button>
                </>
              ) : (
                <>
                  {navLinks.map((l) => (<Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground">{l.label}</Link>))}
                  <div className="my-2 h-px bg-border" />
                  <Link href="/login" onClick={() => setIsOpen(false)}><Button variant="ghost" className="w-full justify-start">Log In</Button></Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}><Button className="w-full">Start Free</Button></Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

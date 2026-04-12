"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTranslations } from "@/hooks/use-translations";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated" && !!session?.user;
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Image src="/icon.png" alt="GP" width={28} height={28} className="h-7 w-7" />
          <span className="text-base font-semibold tracking-tight">Granted Path</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {!loggedIn ? (
            <>
              <Link href="#cum-functioneaza" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("howItWorks")}</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link>
              <Link href="/beta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Beta</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{tc("dashboard")}</Link>
              <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("learn")}</Link>
              <Link href="/ai-chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("aiChat")}</Link>
            </>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {loggedIn ? (
            <>
              <Link href="/settings" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {session?.user?.image ? (
                  <Image src={session?.user?.image} alt="" width={22} height={22} className="h-5.5 w-5.5 rounded-full" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-[120px] truncate">{session?.user?.name || session?.user?.email}</span>
              </Link>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">{tc("login")}</Button></Link>
              <Link href="/register"><Button size="sm">Începe gratuit</Button></Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-8 flex flex-col gap-4">
                {loggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      {session?.user?.image ? (
                        <Image src={session?.user?.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"><User className="h-4 w-4 text-primary" /></div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </div>
                    <div className="h-px bg-border" />
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><LayoutDashboard className="h-4 w-4" />{tc("dashboard")}</Link>
                    <Link href="/learn" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{t("learn")}</Link>
                    <Link href="/ai-chat" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{t("aiChat")}</Link>
                    <Link href="/settings" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{tc("settings")}</Link>
                    <div className="h-px bg-border" />
                    <div className="px-3"><LanguageSwitcher /></div>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}><LogOut className="mr-2 h-4 w-4" />{tc("logout")}</Button>
                  </>
                ) : (
                  <>
                    <Link href="#cum-functioneaza" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{t("howItWorks")}</Link>
                    <Link href="#pricing" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{t("pricing")}</Link>
                    <Link href="/beta" onClick={() => setIsOpen(false)} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Beta</Link>
                    <div className="h-px bg-border" />
                    <div className="px-3"><LanguageSwitcher /></div>
                    <Link href="/login" onClick={() => setIsOpen(false)}><Button variant="ghost" className="w-full justify-start">{tc("login")}</Button></Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}><Button className="w-full">Începe gratuit</Button></Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email,setEmail]=useState(""); const [loading,setLoading]=useState(false); const [sent,setSent]=useState(false);
  async function onSubmit(e:React.FormEvent) { e.preventDefault(); setLoading(true); await new Promise(r=>setTimeout(r,1500)); setSent(true); setLoading(false); }

  if(sent) return (
    <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail className="h-6 w-6"/></div>
      <h1 className="text-2xl font-bold">Check Your Email</h1>
      <p className="mt-3 text-sm text-muted-foreground">We&apos;ve sent a reset link to <strong className="text-foreground">{email}</strong>.</p>
      <p className="mt-4 text-xs text-muted-foreground">Didn&apos;t receive it? <button onClick={()=>setSent(false)} className="text-primary hover:underline">Try again</button></p>
      <Link href="/login" className="mt-6 inline-block"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Login</Button></Link>
    </div>
  );

  return (
    <div className="rounded-xl border border-border/50 bg-card p-8">
      <div className="mb-6 text-center"><h1 className="text-2xl font-bold">Reset Password</h1><p className="mt-1 text-sm text-muted-foreground">Enter your email for a reset link</p></div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <Button type="submit" className="w-full glow-amber" disabled={loading}>{loading?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Sending...</>:"Send Reset Link"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Remember your password? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link></p>
    </div>
  );
}

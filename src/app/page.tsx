"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, BarChart3, Shield, BookOpen } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

type Stats = { users: number; courses: number; lessons: number; achievements: number };

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const tc = useTranslations("common");

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[13px] text-muted-foreground mb-6 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {stats ? `${stats.users} utilizatori activi` : "Platforma activa"}
            </div>

            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              Sistemul tau de invatare,{" "}
              <span className="text-primary">bazat pe AI</span>
            </h1>

            <p className="mt-4 max-w-[420px] text-[15px] leading-[1.65] text-muted-foreground">
              Un AI care analizeaza cum performezi, detecteaza ce uiti
              si te corecteaza cand gresesti. Nu un chatbot — un tutor real.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link href="/register">
                <Button className="h-9 px-5 text-[13px]">
                  {tc("getStarted")}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/learn" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                Exploreaza cursuri →
              </Link>
            </div>

            {stats && (
              <div className="mt-6 flex items-center gap-4 text-[12px] text-muted-foreground">
                <span><strong className="text-foreground">{stats.courses}</strong> cursuri</span>
                <span className="h-3 w-px bg-border" />
                <span><strong className="text-foreground">{stats.lessons}</strong> lectii</span>
                <span className="h-3 w-px bg-border" />
                <span><strong className="text-foreground">{stats.achievements}</strong> realizari</span>
              </div>
            )}

            {/* AI Preview — sub stats */}
            <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/15" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/15" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/15" />
                </div>
                <span className="ml-2 text-[10px] text-muted-foreground">Granted Path — Sesiune AI</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="rounded-lg rounded-br-sm bg-primary/10 border border-primary/20 px-3 py-1.5 max-w-[240px]">
                    <p className="text-[12px]">Cred ca listele si tuplele sunt acelasi lucru in Python</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-primary font-medium mb-1">Granted Path AI</p>
                  <div className="text-[12px] leading-[1.6] text-muted-foreground space-y-1.5">
                    <p><strong className="text-foreground">Nu chiar.</strong> Diferenta e fundamentala:</p>
                    <div className="rounded border border-border bg-muted/50 p-2 text-[11px] space-y-0.5">
                      <p><strong className="text-foreground">List</strong> = mutabil</p>
                      <p><strong className="text-foreground">Tuple</strong> = imutabil</p>
                    </div>
                  </div>
                </div>
                <div className="rounded bg-primary/[0.05] border border-primary/10 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground"><span className="text-primary font-medium">Nota:</span> AI-ul corecteaza presupuneri gresite, nu le confirma.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col justify-center">
            <p className="text-[12px] font-medium text-primary tracking-wide uppercase mb-2">Produsul</p>
            <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tracking-[-0.02em] max-w-[380px]">
              Un tutor care preda, nu doar raspunde
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Brain, title: "Adaptive learning", desc: "Ajusteaza dificultatea si formatul bazat pe performanta ta reala." },
                { icon: BarChart3, title: "Monitorizare continua", desc: "Fiecare sesiune si raspuns este analizat pentru a-ti optimiza parcursul." },
                { icon: Shield, title: "Feedback onest", desc: "Te corecteaza cand gresesti. Nu te aproba fals." },
                { icon: BookOpen, title: "Continut structurat", desc: stats ? `${stats.courses} cursuri cu ${stats.lessons} lectii, create de experti si AI.` : "Cursuri si lectii create de experti si AI." },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <Icon className="h-4 w-4 text-primary mb-2" />
                    <h3 className="text-[13px] font-semibold">{f.title}</h3>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-[1.5]">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

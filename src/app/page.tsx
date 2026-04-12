"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Brain, BarChart3, Zap, Target, Users, Star, ChevronDown } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useState } from "react";

export default function LandingPage() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-Powered Learning Platform
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Sistemul tău personal de învățare,{" "}
              <span className="text-gradient">bazat pe AI</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Un AI care învață cum înveți tu și îți optimizează progresul în timp real.
              Nu un simplu chatbot — un tutor care te cunoaște.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base font-medium">
                  Începe gratuit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#cum-functioneaza">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium">
                  Află mai mult
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-1 shadow-2xl shadow-primary/5">
              <div className="rounded-lg bg-muted/50 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-muted-foreground">Granted Path — Dashboard</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Progres Zilnic</p>
                    <p className="mt-1 text-2xl font-semibold">87%</p>
                    <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{width:"87%"}} /></div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Serie Curentă</p>
                    <p className="mt-1 text-2xl font-semibold">12 zile</p>
                    <p className="mt-2 text-xs text-primary">↑ Record personal</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">AI Recomandare</p>
                    <p className="mt-1 text-sm text-muted-foreground">Revizuiește Python loops — risc de uitare detectat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CUM FUNCȚIONEAZĂ ─── */}
      <section id="cum-functioneaza" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary mb-3">Cum funcționează</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Trei pași simpli</h2>
            <p className="mt-4 text-muted-foreground">De la zero la progres real, în mai puțin de 5 minute.</p>
          </div>

          <div className="mt-16 grid gap-8 sm:gap-12 lg:grid-cols-3">
            {[
              { step: "01", title: "Alegi ce vrei să înveți", desc: "Spune AI-ului obiectivul tău — examen, skill nou, carieră. El se ocupă de rest." },
              { step: "02", title: "AI-ul creează plan personalizat", desc: "Analizează cum înveți tu și construiește un parcurs adaptat stilului și ritmului tău." },
              { step: "03", title: "Primești feedback în timp real", desc: "Progresul e monitorizat constant. AI-ul te corectează, te motivează și te ține pe drumul cel bun." },
            ].map((item, i) => (
              <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-4xl font-bold text-primary/20">{item.step}</span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DE CE E DIFERIT ─── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary mb-3">De ce Granted Path</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Nu e un alt ChatGPT wrapper</h2>
            <p className="mt-4 text-muted-foreground">Construit de la zero ca sistem de învățare, nu ca interfață peste un LLM.</p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Brain, title: "Adaptive Learning real", desc: "AI-ul ajustează format, dificultate și ritm bazat pe cum performezi — nu pe ce bifezi." },
              { icon: BarChart3, title: "Tracking progres detaliat", desc: "Fiecare sesiune, fiecare răspuns, fiecare tipar — analizat și vizualizat în timp real." },
              { icon: Zap, title: "Feedback inteligent", desc: "Te corectează când greșești. Nu te aprobă fals. Ca un profesor real, nu un yes-man." },
              { icon: Target, title: "Personalizare continuă", desc: "Învață despre tine în timp. Detectează ce ești pe cale să uiți și intervine preventiv." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── REZULTATE / STATS ─── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">Rezultate</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Numere care contează</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { value: "+60%", label: "Retenție informații", desc: "Comparativ cu învățarea tradițională pasivă" },
              { value: "2x", label: "Viteză de învățare", desc: "Prin adaptare în timp real la stilul tău" },
              { value: "24/7", label: "Tutor AI disponibil", desc: "Oricând ai nevoie, fără programare" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold text-gradient">{stat.value}</p>
                <p className="mt-3 font-semibold">{stat.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">Testimoniale</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ce spun utilizatorii</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { name: "Maria P.", role: "Studentă Medicină", text: "Am trecut examenul de anatomie cu AI Coach. M-a forțat să înțeleg, nu doar să memorez." },
              { name: "Andrei M.", role: "Software Engineer", text: "Pregătirea pentru interviu tehnic a fost de 10x mai eficientă decât LeetCode singur." },
              { name: "Elena D.", role: "Profesor Liceu", text: "Portal-ul de educație mi-a schimbat complet modul de monitorizare al elevilor." },
            ].map((t, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">2,800+</p>
              <p>Utilizatori activi</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">4.9/5</p>
              <p>Rating mediu</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">12+</p>
              <p>Domenii de studiu</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="scroll-mt-20 border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">Prețuri</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simplu și transparent</h2>
            <p className="mt-4 text-muted-foreground">Începe gratuit. Fără card de credit.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: "Free", price: "€0", period: "", desc: "Pentru explorare", features: ["2 cursuri active", "20 mesaje AI/zi", "Analize de bază"], cta: "Începe gratuit", highlighted: false },
              { name: "Pro", price: "€30", period: "/lună", desc: "Pentru învățare serioasă", features: ["Cursuri nelimitate", "AI nelimitat", "Mod Panica — examen", "Tutor vocal", "Certificate"], cta: "Începe Pro", highlighted: true },
              { name: "Business", price: "€9", period: "/loc/lună", desc: "Pentru echipe și companii", features: ["Tot din Pro", "Portal management", "Analize echipă", "SSO & integrări", "Support prioritar"], cta: "Contactează-ne", highlighted: false },
            ].map((plan, i) => (
              <div key={i} className={`relative flex flex-col rounded-xl border p-8 ${plan.highlighted ? "border-primary bg-primary/[0.03]" : "border-border bg-card"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Recomandat
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Business" ? "/contact" : "/register"} className="mt-8">
                  <Button variant={plan.highlighted ? "default" : "outline"} className="w-full h-11">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-3">FAQ</p>
            <h2 className="text-3xl font-semibold tracking-tight">Întrebări frecvente</h2>
          </div>

          <div className="divide-y divide-border">
            {[
              { q: "Este gratuit?", a: "Da, planul Free este gratuit pe viață. Include 2 cursuri active și 20 mesaje AI pe zi. Poți face upgrade oricând." },
              { q: "Ce limbă vorbește AI-ul?", a: "AI-ul vorbește în română și engleză. Detectează automat limba ta sau o poți seta din setări." },
              { q: "Funcționează pentru examene?", a: "Da. Modul Panica creează un plan focusat pe ce mai ai de învățat. Am cursuri pentru BAC, permis auto, certificări IT și multe altele." },
              { q: "Pot să-l folosesc pentru echipa mea?", a: "Absolut. Planul Business include portal de management, analize pe echipă, SSO și support dedicat." },
              { q: "Datele mele sunt în siguranță?", a: "Da. Respectăm GDPR complet. Datele sunt stocate în EU, criptate, și nu le folosim pentru antrenarea modelelor AI." },
            ].map((item, i) => (
              <div key={i} className="py-5">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between text-left">
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                {faqOpen === i && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Gata să înveți <span className="text-gradient">mai eficient</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">Crează un cont gratuit în 30 de secunde. Fără card de credit.</p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" className="h-12 px-10 text-base font-medium">
                  Începe gratuit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

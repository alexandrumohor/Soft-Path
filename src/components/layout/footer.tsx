"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/hooks/use-translations";

export function Footer() {
  const t = useTranslations("footer");

  const sections = [
    {
      title: "Produs",
      items: [
        { label: "Funcționalități", href: "#cum-functioneaza" },
        { label: "Prețuri", href: "#pricing" },
        { label: "Pentru Educație", href: "/pricing#education" },
        { label: "Pentru Business", href: "/pricing#business" },
      ],
    },
    {
      title: "Companie",
      items: [
        { label: "Despre noi", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Beta", href: "/beta" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Termeni și condiții", href: "/legal/terms" },
        { label: "Confidențialitate", href: "/legal/privacy" },
        { label: "GDPR", href: "/legal/gdpr" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="GP" width={24} height={24} className="h-6 w-6" />
              <span className="text-sm font-semibold">Granted Path</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Sistemul tău personal de învățare, bazat pe AI.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Granted Training Enterprise SRL
            </p>
          </div>
          {sections.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-sm font-semibold">{sec.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {sec.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Granted Path — Granted Training Enterprise SRL. Toate drepturile rezervate.</p>
          <p>Bucharest, Romania · CUI: RO00000000</p>
        </div>
      </div>
    </footer>
  );
}

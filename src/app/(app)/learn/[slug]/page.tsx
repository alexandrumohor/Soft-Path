"use client";
import { useTranslations } from "@/hooks/use-translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Clock, BookOpen, ChevronRight, Play } from "lucide-react";
import { db } from "@/lib/db";

const CATEGORY_LABELS: Record<string, string> = {
  IT_PROGRAMMING: "IT & Programare",
  BUSINESS_MANAGEMENT: "Business & Management",
  MARKETING: "Marketing",
  LANGUAGES: "Limbi Straine",
  EXAM_PREP: "Pregatire Examene",
  SCIENCES: "Stiinte",
  DESIGN_CREATIVITY: "Design & Creativitate",
  FINANCE_ACCOUNTING: "Finante & Contabilitate",
  LAW_LEGISLATION: "Drept & Legislatie",
  HEALTH_MEDICINE: "Sanatate & Medicina",
  SOFT_SKILLS: "Abilitati Soft",
  CUSTOM: "Custom",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Incepator",
  INTERMEDIATE: "Intermediar",
  ADVANCED: "Avansat",
};

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = useTranslations("common");
  const tc = useTranslations("common");
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const categoryLabel = CATEGORY_LABELS[course.category] || course.category;
  const firstLessonId = course.modules[0]?.lessons[0]?.id;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">Cursuri</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{categoryLabel}</Badge>
          <Badge variant="outline">{DIFFICULTY_LABELS[course.difficulty] || course.difficulty}</Badge>
          <Badge variant="outline">{course.language.toUpperCase()}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">{course.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" />{course.rating} evaluare</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.enrollmentCount.toLocaleString()} inscrisi</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.estimatedHours} ore</span>
          <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{totalLessons} lectii</span>
        </div>

        <div className="mt-6 flex gap-3">
          {firstLessonId && (
            <Link href={`/learn/${course.slug}/lesson/${firstLessonId}`}>
              <Button size="lg" className="glow-amber"><Play className="mr-2 h-4 w-4" />Incepe Cursul</Button>
            </Link>
          )}
          <Button size="lg" variant="outline">Adauga la Obiective</Button>
        </div>
      </div>

      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="py-4 text-center">
          <p className="text-sm"><span className="font-semibold text-primary">Personalizat cu AI</span> — dificultatea si formatul continutului se adapteaza la stilul tau de invatare pe masura ce progresi.</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Programa</h2>
      <div className="space-y-4">
        {course.modules.map((mod, mi) => (
          <Card key={mod.id}>
            <CardContent className="py-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  <span className="text-muted-foreground mr-2">Modul {mi + 1}:</span>
                  {mod.title}
                </h3>
                <span className="text-xs text-muted-foreground">{mod.lessons.length} lessons</span>
              </div>
              <div className="space-y-2">
                {mod.lessons.map((lesson, li) => (
                  <Link key={lesson.id} href={`/learn/${course.slug}/lesson/${lesson.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50 group">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {mi * 10 + li + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{lesson.title}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{lesson.estimatedMinutes} min</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

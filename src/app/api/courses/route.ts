import { NextResponse } from "next/server";
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

export async function GET() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = courses.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    category: c.category,
    categoryLabel: CATEGORY_LABELS[c.category] || c.category,
    difficulty: c.difficulty,
    difficultyLabel: DIFFICULTY_LABELS[c.difficulty] || c.difficulty,
    estimatedHours: c.estimatedHours,
    language: c.language,
    rating: c.rating,
    enrollmentCount: c.enrollmentCount,
    modules: c.modules.map(m => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map(l => ({
        id: l.id,
        title: l.title,
        estimatedMinutes: l.estimatedMinutes,
      })),
    })),
  }));

  return NextResponse.json(mapped);
}

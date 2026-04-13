import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL not set");

const adapter = new PrismaNeon({ connectionString: databaseUrl });
const db = new PrismaClient({ adapter });

async function seedAchievements() {
  const achievements = [
    { name: "Primii Pasi", description: "Completeaza prima ta lectie", rarity: "COMMON", condition: { type: "lessons_completed", count: 1 } },
    { name: "Minte Curioasa", description: "Completeaza 10 lectii", rarity: "COMMON", condition: { type: "lessons_completed", count: 10 } },
    { name: "Cursant Dedicat", description: "Completeaza 50 de lectii", rarity: "UNCOMMON", condition: { type: "lessons_completed", count: 50 } },
    { name: "Demolator de Cursuri", description: "Termina primul tau curs", rarity: "UNCOMMON", condition: { type: "courses_completed", count: 1 } },
    { name: "Seria Incepe", description: "Mentine o serie de invatare de 7 zile", rarity: "COMMON", condition: { type: "streak_days", count: 7 } },
    { name: "Serie de Fier", description: "Mentine o serie de invatare de 30 de zile", rarity: "RARE", condition: { type: "streak_days", count: 30 } },
    { name: "Serie de Diamant", description: "Mentine o serie de invatare de 100 de zile", rarity: "EPIC", condition: { type: "streak_days", count: 100 } },
    { name: "Campion la Quiz", description: "Obtine 100% la 10 quiz-uri", rarity: "UNCOMMON", condition: { type: "perfect_quizzes", count: 10 } },
    { name: "Pregatit de Examen", description: "Completeaza o simulare de examen completa", rarity: "RARE", condition: { type: "exams_completed", count: 1 } },
    { name: "Poliglot", description: "Incepe cursuri in 3 limbi diferite", rarity: "RARE", condition: { type: "languages_started", count: 3 } },
    { name: "Mana de Ajutor", description: "Raspunde la 25 de intrebari in grupuri de studiu", rarity: "UNCOMMON", condition: { type: "group_answers", count: 25 } },
    { name: "Bufnita de Noapte", description: "Studiaza 30 de minute dupa ora 22", rarity: "COMMON", condition: { type: "late_session", count: 1 } },
    { name: "Pasare Matinala", description: "Studiaza 30 de minute inainte de ora 7", rarity: "COMMON", condition: { type: "early_session", count: 1 } },
    { name: "Maestru Granted", description: "Completeaza 10 cursuri cu media 90%+", rarity: "LEGENDARY", condition: { type: "master_courses", count: 10 } },
  ] as const;

  // Delete old achievements first
  await db.achievement.deleteMany({});

  for (const a of achievements) {
    await db.achievement.create({
      data: { name: a.name, description: a.description, rarity: a.rarity, condition: a.condition },
    });
  }
  console.log(`✓ ${achievements.length} realizari adaugate`);
}

async function seedCourses() {
  // Delete old courses (cascades to modules + lessons)
  await db.lesson.deleteMany({});
  await db.module.deleteMany({});
  await db.course.deleteMany({});

  const courses = [
    {
      slug: "fundamentele-python",
      title: "Fundamentele Python",
      description: "Invata Python de la zero — variabile, flux de control, functii, OOP si primul tau proiect real. Creat pentru incepatori completi.",
      category: "IT_PROGRAMMING",
      subcategory: "Programare",
      difficulty: "BEGINNER",
      estimatedHours: 12,
      language: "ro",
      modules: [
        { title: "Primii Pasi cu Python", lessons: ["De ce Python?", "Instalarea Python si VS Code", "Primul tau script Python", "Variabile si tipuri"] },
        { title: "Flux de Control", lessons: ["if / elif / else", "Bucle for si while", "Break, continue, pass", "Exercitii practice"] },
        { title: "Functii si Module", lessons: ["Definirea functiilor", "Argumente si valori returnate", "Importarea modulelor", "Tur al bibliotecii standard"] },
        { title: "Python Orientat pe Obiecte", lessons: ["Clase si obiecte", "Mostenire", "Metode magice", "Construirea unui mic tool CLI"] },
      ],
    },
    {
      slug: "esentialele-javascript",
      title: "Esentialele JavaScript",
      description: "JavaScript modern de la baza — ES6+, async, DOM, fetch API si cum sa construiesti pagini web interactive.",
      category: "IT_PROGRAMMING",
      subcategory: "Dezvoltare Web",
      difficulty: "BEGINNER",
      estimatedHours: 14,
      language: "ro",
      modules: [
        { title: "Bazele JavaScript", lessons: ["Ce face de fapt JavaScript", "Variabile: let, const, var", "Tipuri si conversie", "Operatori si expresii"] },
        { title: "Functii si Scope", lessons: ["Declaratii vs expresii de functii", "Arrow functions", "Closures explicat", "this si bind"] },
        { title: "JavaScript Asincron", lessons: ["Callback-uri", "Promises", "Async / await", "Fetch API"] },
        { title: "DOM si Evenimente", lessons: ["Selectarea elementelor", "Event listeners", "Modificarea DOM-ului", "Construirea unei aplicatii todo"] },
      ],
    },
    {
      slug: "fundamentele-marketingului",
      title: "Fundamentele Marketingului",
      description: "Principiile pe care orice marketer ar trebui sa le stie — pozitionare, mesaje, canale, funnels si cum sa masori ce conteaza.",
      category: "MARKETING",
      subcategory: "Strategie",
      difficulty: "BEGINNER",
      estimatedHours: 8,
      language: "ro",
      modules: [
        { title: "Bazele Marketingului", lessons: ["Ce este de fapt marketingul", "Focus pe client vs produs", "Cei 4 P", "Pozitionarea"] },
        { title: "Canale", lessons: ["Organic vs platit", "Marketing de continut", "Social media", "Email marketing"] },
        { title: "Funnel-uri si Metrici", lessons: ["Conceptul de funnel", "Rate de conversie", "CAC si LTV", "Atribuire"] },
      ],
    },
    {
      slug: "conversatie-engleza-b2",
      title: "Conversatie Engleza — B2",
      description: "Vorbeste engleza cu incredere. Conversatii din viata reala, expresii, exercitii de pronuntie si roleplay cu AI.",
      category: "LANGUAGES",
      subcategory: "Engleza",
      difficulty: "INTERMEDIATE",
      estimatedHours: 20,
      language: "ro",
      modules: [
        { title: "Conversatie Zilnica", lessons: ["Saluturi si small talk", "Intrebari de directie", "La restaurant", "Cumparaturi"] },
        { title: "Situatii de Munca", lessons: ["Bazele interviului de angajare", "Eticheta email", "Vocabular de sedinta", "Fraze de negociere"] },
        { title: "Expresii si Phrasal Verbs", lessons: ["Top 50 expresii", "Phrasal verbs cu 'get'", "Phrasal verbs cu 'take'", "Greseli comune"] },
      ],
    },
    {
      slug: "permis-auto-categoria-b",
      title: "Permis Auto — Categoria B",
      description: "Pregatire completa pentru examenul auto categoria B in Romania. Legislatie, pericole, intrebari tipice.",
      category: "EXAM_PREP",
      subcategory: "Sofat",
      difficulty: "BEGINNER",
      estimatedHours: 15,
      language: "ro",
      modules: [
        { title: "Legislatie Rutiera", lessons: ["Definitii esentiale", "Documente obligatorii", "Drepturi si obligatii", "Sanctiuni"] },
        { title: "Indicatoare Rutiere", lessons: ["Indicatoare de avertizare", "Indicatoare de interzicere", "Indicatoare de obligare", "Indicatoare de orientare"] },
        { title: "Conducere Defensiva", lessons: ["Distanta de siguranta", "Depasirea", "Intersectii fara semafor", "Conditii meteo dificile"] },
      ],
    },
    {
      slug: "bazele-managementului-de-proiect",
      title: "Bazele Managementului de Proiect",
      description: "De la kickoff la livrare — scop, timeline, stakeholderi, riscuri si abilitatile soft care chiar misca proiectele inainte.",
      category: "BUSINESS_MANAGEMENT",
      subcategory: "Management de Proiect",
      difficulty: "BEGINNER",
      estimatedHours: 10,
      language: "ro",
      modules: [
        { title: "Fundamente de Proiect", lessons: ["Ce este un proiect?", "Ciclul de viata al proiectului", "Stakeholderi", "Scop si constrangeri"] },
        { title: "Planificare", lessons: ["Structura de defalcare a muncii", "Estimarea efortului", "Diagrame Gantt", "Identificarea riscurilor"] },
        { title: "Executie si Inchidere", lessons: ["Daily stand-ups", "Raportarea statusului", "Managementul schimbarii", "Lectii invatate"] },
      ],
    },
  ] as const;

  for (const c of courses) {
    await db.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.category,
        subcategory: c.subcategory,
        difficulty: c.difficulty,
        estimatedHours: c.estimatedHours,
        language: c.language,
        isPublished: true,
        modules: {
          create: c.modules.map((m, mi) => ({
            title: m.title,
            order: mi + 1,
            lessons: {
              create: m.lessons.map((title, li) => ({
                title,
                order: li + 1,
                type: "TEXT",
                estimatedMinutes: 8,
                content: [
                  { type: "heading", text: title },
                  { type: "paragraph", text: `Bine ai venit la "${title}". Aceasta lectie face parte din cursul "${c.title}".` },
                  { type: "paragraph", text: "Continutul tutorului AI va fi generat dinamic cand incepi aceasta lectie." },
                ],
              })),
            },
          })),
        },
      },
    });
    console.log(`  ✓ ${c.slug}`);
  }
  console.log(`✓ ${courses.length} cursuri adaugate`);
}

async function main() {
  console.log("🌱 Se populeaza baza de date...\n");
  await seedAchievements();
  await seedCourses();
  console.log("\n✅ Seed complet");
}

main()
  .catch(e => {
    console.error("❌ Seed esuat:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

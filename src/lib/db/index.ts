// Run `npx prisma generate` after setting DATABASE_URL to activate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClientModule: any;
try { PrismaClientModule = require("@prisma/client").PrismaClient; } catch {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };
export const db = globalForPrisma.prisma ?? (PrismaClientModule ? new PrismaClientModule({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] }) : null);
if (process.env.NODE_ENV !== "production" && db) globalForPrisma.prisma = db;

import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type HealthStatus = "operational" | "degraded" | "down";

type ServiceCheck = {
  name: string;
  status: HealthStatus;
  latency?: number;
  error?: string;
};

async function checkService(name: string, fn: () => Promise<void>): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    await fn();
    return { name, status: "operational", latency: Date.now() - start };
  } catch (error) {
    return {
      name,
      status: "down",
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const checks = await Promise.all([
    checkService("anthropic", async () => {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");
    }),
    checkService("database", async () => {
      if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
    }),
    checkService("redis", async () => {
      if (!process.env.UPSTASH_REDIS_REST_URL) throw new Error("Redis not configured");
    }),
    checkService("stripe", async () => {
      if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe not configured");
    }),
    checkService("email", async () => {
      if (!process.env.RESEND_API_KEY) throw new Error("Resend not configured");
    }),
  ]);

  const allOperational = checks.every(c => c.status === "operational");
  const allDown = checks.every(c => c.status === "down");
  const overall: HealthStatus = allOperational ? "operational" : allDown ? "down" : "degraded";

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
      region: process.env.VERCEL_REGION || "local",
      services: checks,
    },
    { status: overall === "down" ? 503 : 200 }
  );
}

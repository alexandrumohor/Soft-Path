export async function initSentryEdge() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  console.log("[Sentry] Edge runtime instrumentation ready (stub)");
}

initSentryEdge();

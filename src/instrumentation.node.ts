export async function initSentryNode() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  console.log("[Sentry] Node runtime instrumentation ready (stub)");
}

initSentryNode();

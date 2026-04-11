export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await import("./instrumentation.node");
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await import("./instrumentation.edge");
    }
  }
}

export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string> }
) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error("[Granted Path]", err, request);
    return;
  }
  console.error("[Sentry]", err, request.path, request.method);
};

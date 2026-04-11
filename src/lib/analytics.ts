type EventProps = Record<string, string | number | boolean | null | undefined>;

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

let posthogLoaded = false;

declare global {
  interface Window {
    posthog?: {
      init: (key: string, config: { api_host: string; person_profiles: string }) => void;
      capture: (event: string, props?: EventProps) => void;
      identify: (id: string, props?: EventProps) => void;
      reset: () => void;
      opt_out_capturing: () => void;
      opt_in_capturing: () => void;
    };
  }
}

export function initAnalytics() {
  if (typeof window === "undefined" || !KEY || posthogLoaded) return;

  const script = document.createElement("script");
  script.src = `${HOST}/static/array.js`;
  script.async = true;
  script.onload = () => {
    window.posthog?.init(KEY, { api_host: HOST, person_profiles: "identified_only" });
    posthogLoaded = true;
  };
  document.head.appendChild(script);
}

export function track(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  window.posthog?.capture(event, props);
}

export function identify(userId: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  window.posthog?.identify(userId, props);
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  window.posthog?.reset();
}

export function optOut() {
  if (typeof window === "undefined") return;
  window.posthog?.opt_out_capturing();
}

export function optIn() {
  if (typeof window === "undefined") return;
  window.posthog?.opt_in_capturing();
}

export const events = {
  signup: "user_signup",
  login: "user_login",
  logout: "user_logout",
  onboardingCompleted: "onboarding_completed",
  lessonStarted: "lesson_started",
  lessonCompleted: "lesson_completed",
  quizSubmitted: "quiz_submitted",
  flashcardReviewed: "flashcard_reviewed",
  aiChatSent: "ai_chat_sent",
  voiceSessionStarted: "voice_session_started",
  examPredictorRun: "exam_predictor_run",
  subscriptionStarted: "subscription_started",
  subscriptionUpgraded: "subscription_upgraded",
  subscriptionCanceled: "subscription_canceled",
  betaWaitlistJoined: "beta_waitlist_joined",
  certificateEarned: "certificate_earned",
} as const;

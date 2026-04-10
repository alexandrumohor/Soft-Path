"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLearningStore } from "@/stores/learning-store";
import type { LearningEventType } from "@/types";

interface TrackingEvent { type: LearningEventType; metadata?: Record<string, unknown>; timestamp: string; sessionId: string | null; }

export function useTracking() {
  const eventQueue = useRef<TrackingEvent[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const batchTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { currentSession, setIdle } = useLearningStore();

  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;
    const events = [...eventQueue.current];
    eventQueue.current = [];
    try { await fetch("/api/tracking/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ events }) }); }
    catch { eventQueue.current = [...events, ...eventQueue.current]; }
  }, []);

  const trackEvent = useCallback((type: LearningEventType, metadata?: Record<string, unknown>) => {
    eventQueue.current.push({ type, metadata, timestamp: new Date().toISOString(), sessionId: currentSession?.sessionId ?? null });
  }, [currentSession]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIdle(false);
    idleTimer.current = setTimeout(() => { setIdle(true); trackEvent("IDLE_DETECTED"); }, 60_000);
  }, [setIdle, trackEvent]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }));
    const handleVis = () => { trackEvent("TAB_SWITCH", { hidden: document.hidden }); if (!document.hidden) resetIdleTimer(); };
    document.addEventListener("visibilitychange", handleVis);
    batchTimer.current = setInterval(flushEvents, 30_000);
    const handleUnload = () => flushEvents();
    window.addEventListener("beforeunload", handleUnload);
    resetIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      document.removeEventListener("visibilitychange", handleVis);
      window.removeEventListener("beforeunload", handleUnload);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (batchTimer.current) clearInterval(batchTimer.current);
      flushEvents();
    };
  }, [resetIdleTimer, trackEvent, flushEvents]);

  return { trackEvent, flushEvents };
}

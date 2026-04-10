import { create } from "zustand";

interface LearningSession { sessionId: string; startedAt: Date; topicId: string | null; isActive: boolean; }

interface LearningState {
  currentSession: LearningSession | null; isIdle: boolean; todayMinutes: number; currentStreak: number;
  startSession: (topicId?: string) => void; endSession: () => void; setIdle: (idle: boolean) => void; setTodayMinutes: (m: number) => void; setStreak: (s: number) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  currentSession: null, isIdle: false, todayMinutes: 0, currentStreak: 0,
  startSession: (topicId) => set({ currentSession: { sessionId: crypto.randomUUID(), startedAt: new Date(), topicId: topicId ?? null, isActive: true } }),
  endSession: () => set({ currentSession: null }),
  setIdle: (isIdle) => set((s) => ({ isIdle, currentSession: s.currentSession ? { ...s.currentSession, isActive: !isIdle } : null })),
  setTodayMinutes: (todayMinutes) => set({ todayMinutes }),
  setStreak: (currentStreak) => set({ currentStreak }),
}));

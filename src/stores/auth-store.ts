import { create } from "zustand";
import type { SubscriptionTier, LearnerProfile } from "@/types";

interface User { id: string; name: string; email: string; avatar: string | null; role: string; tier: SubscriptionTier; onboardingCompleted: boolean; learnerProfile: LearnerProfile | null; }

interface AuthState { user: User | null; isLoading: boolean; setUser: (user: User | null) => void; setLoading: (loading: boolean) => void; logout: () => void; }

export const useAuthStore = create<AuthState>((set) => ({
  user: null, isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isLoading: false }),
}));

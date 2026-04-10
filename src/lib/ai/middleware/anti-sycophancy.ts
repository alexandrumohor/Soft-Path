import type { ConvictionState, ConvictionLevel } from "@/types";
import { ESCALATION_RESPONSES } from "@/constants";

export function shouldHoldPosition(context: { confidenceLevel: number; userInsistenceCount: number }): {
  hold: boolean;
  escalationLevel: ConvictionLevel;
  responsePrefix: string;
} {
  const { confidenceLevel, userInsistenceCount } = context;

  if (confidenceLevel < 60) {
    return { hold: false, escalationLevel: 1, responsePrefix: "I'm not entirely certain. You might be right. Let me reconsider..." };
  }

  const escalationLevel = Math.min(userInsistenceCount, 5) as ConvictionLevel;

  if (escalationLevel >= 5) {
    return { hold: false, escalationLevel: 5, responsePrefix: ESCALATION_RESPONSES[4]! };
  }

  return { hold: true, escalationLevel, responsePrefix: ESCALATION_RESPONSES[escalationLevel - 1] ?? ESCALATION_RESPONSES[0]! };
}

export function createConvictionState(claimId: string, aiPosition: string, confidenceLevel: number): ConvictionState {
  return { claimId, aiPosition, confidenceLevel: Math.max(0, Math.min(100, confidenceLevel)), escalationLevel: 1, resolved: false };
}

export function escalateConviction(state: ConvictionState): ConvictionState {
  const newLevel = Math.min(state.escalationLevel + 1, 5) as ConvictionLevel;
  return { ...state, escalationLevel: newLevel, resolved: newLevel >= 5 };
}

export function buildDisputeInstruction(state: ConvictionState): string {
  if (state.resolved) return `[DISPUTE RESOLVED] Flag "${state.aiPosition}" for future quiz. Do not bring up again.`;
  return `[ACTIVE DISPUTE ${state.escalationLevel}/5] Claim: "${state.aiPosition}" (confidence: ${state.confidenceLevel}%). Hold position. Explain from ${state.escalationLevel >= 3 ? "evidence-based" : "different"} angle.`;
}

export function detectInsistence(userMessage: string): boolean {
  return [/\bno\b.*\bi('m| am)\s+(right|correct)/i, /\byou('re| are)\s+wrong\b/i, /\bi\s+(still\s+)?think\b/i, /\bnu\b.*\bam\s+dreptate/i, /\bte\s+inseli/i, /\bgresesti/i].some((p) => p.test(userMessage));
}

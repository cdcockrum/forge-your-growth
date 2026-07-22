import type {
  ForgeCoachResult,
  ForgeInsight,
  HistoryResult,
  IdentityEngineResult,
  MemoryResult,
  MomentumResult,
  ProgressSummary,
  WeeklyNarrative,
} from "@/features/forge-engine";

import type {
  Vision,
} from "@/features/vision";

export type AdvisorPriority =
  | "identity"
  | "consistency"
  | "focus"
  | "recovery"
  | "vision";

export type AdvisorBriefing = {
  title: string;
  message: string;
  priority: AdvisorPriority;
  confidence: number;
  actions: string[];
  reasoning: string[];
};

export type AdvisorInput = {
  vision: Vision | null;
  progress: ProgressSummary;
  momentum: MomentumResult;
  identity: IdentityEngineResult;
  coach: ForgeCoachResult;
  insight: ForgeInsight;
  memory: MemoryResult;
  narrative: WeeklyNarrative;
  history: HistoryResult;
};
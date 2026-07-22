import type {
  AdvisorBriefing,
  ForgeInsight,
  ForgeCoachResult,
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

export type IntelligenceInput = {
  vision: Vision | null;

  progress: ProgressSummary;

  momentum: MomentumResult;

  identity: IdentityEngineResult;

  coach: ForgeCoachResult;

  insight: ForgeInsight;

  advisor: AdvisorBriefing;

  memory: MemoryResult;

  history: HistoryResult;

  narrative: WeeklyNarrative;
};

export type IntelligenceConclusion = {
  title: string;

  summary: string;

  confidence: number;

  evidence: string[];

  reasoning: string[];

  recommendation: string;
};
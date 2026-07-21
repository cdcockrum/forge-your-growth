import type {
  ForgeCoachResult,
  ForgeHealthScoreResult,
  ForgeScoreResult,
  IdentityEngineResult,
  MomentumResult,
  ProgressSummary,
} from "@/features/forge-engine";

import type {
  WeeklyNarrative,
} from "@/features/forge-engine/narrative";

import type {
  Vision,
} from "@/features/vision";

export type ForgeInsight = {
  headline: string;

  summary: string;

  strengths: string[];

  opportunities: string[];

  risks: string[];

  recommendation: string;

  confidence: number;
};

export type SynthesisInput = {
  vision: Vision | null;

  progress: ProgressSummary;

  momentum: MomentumResult;

  forgeScore: ForgeScoreResult;

  forgeHealth: ForgeHealthScoreResult;

  identity: IdentityEngineResult;

  coach: ForgeCoachResult;

  narrative: WeeklyNarrative;
};
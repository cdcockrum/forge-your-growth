import type { Vision } from "@/features/vision";

import type {
  AdvisorBriefing,
} from "./advisor";

import type {
  AdvisorAnalysis,
} from "./advisor-v2";

import type {
  BeliefResult,
} from "./beliefs";

import type {
  DailyBriefing,
} from "./briefing";

import type {
  ForgeCognitiveState,
} from "./cognitive-state";

import type {
  ContradictionResult,
} from "./contradictions";

import type {
  ForgeCoachResult,
} from "./coach";

import type {
  EvidenceGraph,
} from "./evidence";

import type {
  HistoryResult,
} from "./history";

import type {
  IdentityEngineResult,
} from "./identity";

import type {
  IntelligenceConclusion,
} from "./intelligence";

import type {
  MemoryResult,
} from "./memory";

import type {
  MomentumResult,
} from "./momentum";

import type {
  WeeklyNarrative,
} from "./narrative";

import type {
  PatternSummary,
} from "./patterns";

import type {
  WeeklyPlanAssessment,
} from "./planning-assessment/assessment.types";

import type {
  PredictionResult,
} from "./prediction";

import type {
  ProgressSummary,
} from "./progress";

import type {
  ForgeInsight,
} from "./synthesis";

import type {
  TraitEngineResult,
} from "./traits";

import type {
  PracticeTrendAnalysis,
} from "./trends";

import type {
  ForgeHealthScoreResult,
  ForgeScoreResult,
} from "./types";

export type ForgeState = {
  vision: Vision | null;

  progress: ProgressSummary;

  forgeScore: ForgeScoreResult;

  forgeHealth: ForgeHealthScoreResult;

  momentum: MomentumResult;

  identity: IdentityEngineResult;

  coach: ForgeCoachResult;

  assessment?: WeeklyPlanAssessment;

  narrative: WeeklyNarrative;

  /*
   * Existing Advisor system.
   */
  advisor: AdvisorBriefing;

  /*
   * Evidence-driven Advisor V2 analysis.
   */
  advisorAnalysis: AdvisorAnalysis;

  insight: ForgeInsight;

  history: HistoryResult;

  memory: MemoryResult;

  intelligence: IntelligenceConclusion;

  evidence: EvidenceGraph;

  traits: TraitEngineResult;

  cognitiveState: ForgeCognitiveState;

  dailyBriefing: DailyBriefing;

  beliefs: BeliefResult;

  contradictions: ContradictionResult;

  patterns: PatternSummary;

  predictions: PredictionResult;

  trendAnalysis: PracticeTrendAnalysis;
};
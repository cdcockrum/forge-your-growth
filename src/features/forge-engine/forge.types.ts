import type {
  ProgressSummary,
} from "./progress";

import type {
  ForgeScoreResult,
  ForgeHealthScoreResult,
} from "./types";

import type {
  MomentumResult,
} from "./momentum";

import type {
  IdentityEngineResult,
} from "./identity";

import type {
  ForgeCoachResult,
} from "./coach";

import type {
  WeeklyPlanAssessment,
} from "./planning-assessment/assessment.types";

import type { Vision } from "@/features/vision";

import type {
  WeeklyNarrative,
} from "./narrative";

import type { ForgeInsight } from "./synthesis";

import type {
  HistoryResult,
} from "./history";

import type {
  MemoryResult,
} from "./memory";

import type {
  AdvisorBriefing,
} from "./advisor";


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

  advisor: AdvisorBriefing;

  insight: ForgeInsight;

  history: HistoryResult;

  memory: MemoryResult;

};
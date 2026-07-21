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
  IdentityProgress,
} from "./identity";

import type {
  ForgeCoachResult,
} from "./coach";

import type {
  WeeklyPlanAssessment,
} from "./planning-assessment/assessment.types";

import type { Vision } from "@/features/vision";


export type ForgeState = {

  vision: Vision | null;

  progress: ProgressSummary;

  forgeScore: ForgeScoreResult;

  forgeHealth: ForgeHealthScoreResult;

  momentum: MomentumResult;

  identity: IdentityProgress;

  coach: ForgeCoachResult;

  assessment?: WeeklyPlanAssessment;

};
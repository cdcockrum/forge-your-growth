import type {
  Vision,
} from "@/features/vision";

import {
  generateForgeCoach,
} from "../../coach";

import {
  buildHistory,
} from "../../history";

import {
  buildMemory,
  type ForgeMemory,
} from "../../memory";

import {
  buildWeeklyNarrative,
} from "../../narrative";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "../../narrative";

import type {
  WeeklyPlanAssessment,
} from "../../planning-assessment/assessment.types";

import type {
  FoundationStage,
} from "./foundation";

import type {
  InterpretationStage,
} from "./interpretation";

export type ContextStage = {
  memory: ReturnType<typeof buildMemory>;
  coach: ReturnType<typeof generateForgeCoach>;
  narrative: ReturnType<typeof buildWeeklyNarrative>;
  history: ReturnType<typeof buildHistory>;
};

type ContextOptions = {
  vision: Vision | null;
  foundation: FoundationStage;
  interpretation: InterpretationStage;
  assessment?: WeeklyPlanAssessment;
  achievements?: AchievementSnapshot[];
  review?: WeeklyReviewSnapshot | null;

  /**
   * Persisted long-term memories loaded from
   * public.forge_memories.
   */
  persistedMemories?: ForgeMemory[];
};

export function buildContextStage({
  vision,
  foundation,
  interpretation,
  assessment,
  achievements = [],
  review = null,
  persistedMemories = [],
}: ContextOptions): ContextStage {
  const memory = buildMemory({
    progress: foundation.progress,
    momentum: interpretation.momentum,
    identity: interpretation.identity,
  });

  const coach = generateForgeCoach({
    progress: foundation.progress,
    assessment,
  });

  const narrative = buildWeeklyNarrative({
    vision,
    identity: interpretation.identity,
    momentum: interpretation.momentum,
    progress: foundation.progress,
    coach,
    achievements,
    review,
  });

  const history = buildHistory({
    achievements,
    narrativeTitle: narrative.title,
    northStar: vision?.north_star,
    memories: persistedMemories,
  });

  return {
    memory,
    coach,
    narrative,
    history,
  };
}
import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import {
  calculateProgress,
} from "../../progress";

import {
  calculateForgeScore,
} from "../../scoring/score";

import {
  calculateForgeHealthScore,
} from "../../scoring/healthScore";

export type FoundationStage = {
  progress: ReturnType<typeof calculateProgress>;
  forgeScore: ReturnType<typeof calculateForgeScore>;
  forgeHealth: ReturnType<typeof calculateForgeHealthScore>;
};

type FoundationOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
  weeklyReviewCompleted: boolean;
};

export function buildFoundationStage({
  sessions,
  skills,
  lifeAreas,
  weeklyReviewCompleted,
}: FoundationOptions): FoundationStage {
  const progress = calculateProgress({
    sessions,
    skills,
    lifeAreas,
  });

  const forgeScore = calculateForgeScore({
    sessions,
    skills,
    weeklyReviewCompleted,
  });

  const forgeHealth =
    calculateForgeHealthScore({
      sessions,
      skills,
      weeklyReviewCompleted,
    });

  return {
    progress,
    forgeScore,
    forgeHealth,
  };
}
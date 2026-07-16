import {
  calculateProgress,
  calculateMomentum,
  calculateForgeScore,
  generateForgeCoach,
} from ".";

import type {
  PracticeSession,
  Skill,
  LifeArea,
} from "@/features/forge/types";

import type { WeeklyPlanAssessment } from "./planning-assessment/assessment.types";

type PipelineOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
  assessment?: WeeklyPlanAssessment;
};

export function buildForgeState({
  sessions,
  skills,
  lifeAreas,
  assessment,
}: PipelineOptions) {
  const progress = calculateProgress({
    sessions,
    skills,
    lifeAreas,
  });

  const momentum = calculateMomentum({
    progress,
    assessment,
  });

  const forgeScore = calculateForgeScore({
    sessions,
    skills,
  });

  const coach = generateForgeCoach({
    progress,
    assessment,
  });

  return {
    progress,
    momentum,
    forgeScore,
    coach,
  };
}
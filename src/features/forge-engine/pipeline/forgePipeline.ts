import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type {
  Vision,
} from "@/features/vision";

import type {
  ForgeState,
} from "../forge.types";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "../narrative";

import type {
  WeeklyPlanAssessment,
} from "../planning-assessment/assessment.types";

import {
  buildContextStage,
  buildExplanationStage,
  buildFoundationStage,
  buildInterpretationStage,
  buildReasoningStage,
} from "./stages";

type PipelineOptions = {
  vision: Vision | null;
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
  assessment?: WeeklyPlanAssessment;
  achievements?: AchievementSnapshot[];
  review?: WeeklyReviewSnapshot | null;
};

export function buildForgeState({
  vision,
  sessions,
  skills,
  lifeAreas,
  assessment,
  achievements = [],
  review = null,
}: PipelineOptions): ForgeState {
  const observation = buildFoundationStage({
    sessions,
    skills,
    lifeAreas,
    weeklyReviewCompleted: Boolean(review),
  });

  const interpretation =
    buildInterpretationStage({
      foundation: observation,
      sessions,
      skills,
      assessment,
    });

  const context = buildContextStage({
    vision,
    foundation: observation,
    interpretation,
    assessment,
    achievements,
    review,
  });

  const reasoning = buildReasoningStage({
    vision,
    foundation: observation,
    interpretation,
    context,
  });

  const explanation =
    buildExplanationStage({
      foundation: observation,
      interpretation,
      reasoning,
    });

  return {
    vision,
    progress: observation.progress,
    momentum: interpretation.momentum,
    forgeScore: observation.forgeScore,
    forgeHealth: observation.forgeHealth,
    identity: interpretation.identity,
    coach: context.coach,
    narrative: context.narrative,
    assessment,
    insight: reasoning.insight,
    history: context.history,
    memory: context.memory,
    advisor: reasoning.advisor,
    intelligence: reasoning.intelligence,
    evidence: explanation.evidence,
  };
}
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

import type {
  ContextStage,
  ExplanationStage,
  FoundationStage,
  InterpretationStage,
  ReasoningStage,
} from "./stages";



export type ForgePipelineOptions = {
  vision: Vision | null;
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
  assessment?: WeeklyPlanAssessment;
  achievements?: AchievementSnapshot[];
  review?: WeeklyReviewSnapshot | null;
};

export type ForgePipelineSnapshot = {
  observation: FoundationStage;
  interpretation: InterpretationStage;
  context: ContextStage;
  reasoning: ReasoningStage;
  explanation: ExplanationStage;
};

export function buildForgePipelineSnapshot({
  vision,
  sessions,
  skills,
  lifeAreas,
  assessment,
  achievements = [],
  review = null,
}: ForgePipelineOptions): ForgePipelineSnapshot {
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
    observation,
    interpretation,
    context,
    reasoning,
    explanation,
  };
}

export function buildForgeState(
  options: ForgePipelineOptions,
): ForgeState {
  const {
    observation,
    interpretation,
    context,
    reasoning,
    explanation,
  } = buildForgePipelineSnapshot(options);

  return {
    vision: options.vision,
    progress: observation.progress,
    momentum: interpretation.momentum,
    forgeScore: observation.forgeScore,
    forgeHealth: observation.forgeHealth,
    identity: interpretation.identity,
    coach: context.coach,
    narrative: context.narrative,
    assessment: options.assessment,
    insight: reasoning.insight,
    history: context.history,
    memory: context.memory,
    advisor: reasoning.advisor,
    intelligence: reasoning.intelligence,
    evidence: explanation.evidence,
    traits: interpretation.traits,
  };
}
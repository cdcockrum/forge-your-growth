import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type { Vision } from "@/features/vision";

import { buildDailyBriefing } from "../briefing";
import { buildCognitiveState } from "../cognitive-state";

import type { ForgeState } from "../forge.types";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "../narrative";

import type { WeeklyPlanAssessment } from "../planning-assessment/assessment.types";

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

import {
  buildBeliefs,
} from "../beliefs";

import {
  buildPatternSummary,
} from "../patterns";

import {
  buildPredictions,
} from "../prediction";

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

  const interpretation = buildInterpretationStage({
    foundation: observation,
    sessions,
    skills,
    assessment,
  });

  /*
   * Context engines may be working with an account that
   * has not accumulated memories or history yet.
   *
   * The context stage is responsible for normalizing those
   * results before they reach the reasoning pipeline.
   */
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

  const explanation = buildExplanationStage({
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

  const history = {
    ...context.history,

    events:
      context.history?.events ??
      [],
  };

  const advisor = {
    ...reasoning.advisor,

    actions:
      reasoning.advisor?.actions ??
      [],

    reasoning:
      reasoning.advisor?.reasoning ??
      [],
  };

  const contradictions =
  reasoning.contradictions;

  const intelligence = {
    ...reasoning.intelligence,

    evidence:
      reasoning.intelligence?.evidence ??
      [],

    reasoning:
      reasoning.intelligence?.reasoning ??
      [],
  };

  const evidence =
    explanation.evidence ??
    [];

  
  const beliefs = buildBeliefs({
      advisor,
      identity:
        interpretation.identity,
      evidence,
      memory:
        context.memory,
    });

  const patterns = buildPatternSummary(
      [],
      options.sessions,
    );

  const predictions = buildPredictions({
    progress:
      observation.progress,

    momentum:
      interpretation.momentum,

    beliefs,

    contradictions,

    patterns,
  });

  const cognitiveState = buildCognitiveState({
    progress: observation.progress,
    momentum: interpretation.momentum,
    identity: interpretation.identity,
    narrative: context.narrative,
    memory: context.memory,
    history,
    evidence,
    predictions,
    intelligence,
    contradictions,
    advisor,
    vision: options.vision,

  });

  const dailyBriefing = buildDailyBriefing({
    cognitiveState,
  });

  return {
  vision: options.vision,

  progress:
    observation.progress,

  momentum:
    interpretation.momentum,

  forgeScore:
    observation.forgeScore,

  forgeHealth:
    observation.forgeHealth,

  identity:
    interpretation.identity,

  coach:
    context.coach,

  narrative:
    context.narrative,

  assessment:
    options.assessment,

  insight:
    reasoning.insight,

  history,

  memory:
    context.memory,

  advisor,

  contradictions,

  intelligence,

  evidence,

  beliefs,

  patterns,

  predictions,

  traits:
    interpretation.traits ??
    [],

  cognitiveState,

  dailyBriefing,
};
}
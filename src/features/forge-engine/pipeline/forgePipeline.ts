import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type { Vision } from "@/features/vision";

import { buildBeliefs } from "../beliefs";
import { buildDailyBriefing } from "../briefing";
import { buildCognitiveState } from "../cognitive-state";

import type { ForgeState } from "../forge.types";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "../narrative";

import { buildPatternSummary } from "../patterns";

import type { WeeklyPlanAssessment } from "../planning-assessment/assessment.types";

import { buildPredictions } from "../prediction";

import {
  buildPracticeTrendAnalysis,
} from "../trends";

import type {
  PracticeTrendAnalysis,
} from "../trends";

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
  userName?: string;
};

export type ForgePipelineSnapshot = {
  observation: FoundationStage;
  interpretation: InterpretationStage;
  context: ContextStage;
  reasoning: ReasoningStage;
  explanation: ExplanationStage;
  trendAnalysis: PracticeTrendAnalysis;
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
   * Trend analysis compares the most recent seven-day
   * period with the preceding seven-day period.
   */
  const trendAnalysis =
    buildPracticeTrendAnalysis({
      sessions,
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
    trendAnalysis,
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
    trendAnalysis,
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

  trendAnalysis,
});

  const dailyBriefing = buildDailyBriefing({
    cognitiveState,
    userName: options.userName,
  });

  return {
    vision:
      options.vision,

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

    trendAnalysis,

    patterns,

    predictions,

    traits:
      interpretation.traits ??
      [],

    cognitiveState,

    dailyBriefing,
  };
}
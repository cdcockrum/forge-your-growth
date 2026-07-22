import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type {
  Vision,
} from "@/features/vision";

import {
  buildAdvisorBriefing,
} from "../advisor";

import {
  generateForgeCoach,
} from "../coach";

import {
  buildEvidenceNodes,
  createEvidenceGraph,
} from "../evidence";

import type {
  ForgeState,
} from "../forge.types";

import {
  buildHistory,
} from "../history";

import {
  calculateIdentityProgress,
} from "../identity";

import {
  buildIntelligenceConclusion,
} from "../intelligence";

import {
  buildMemory,
} from "../memory";

import {
  calculateMomentum,
} from "../momentum";

import {
  buildWeeklyNarrative,
} from "../narrative";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "../narrative";

import type {
  WeeklyPlanAssessment,
} from "../planning-assessment/assessment.types";

import {
  calculateProgress,
} from "../progress";

import {
  calculateForgeHealthScore,
} from "../scoring/healthScore";

import {
  calculateForgeScore,
} from "../scoring/score";

import {
  buildForgeInsight,
} from "../synthesis";

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
  // 1. Core progress and scoring

  const progress = calculateProgress({
    sessions,
    skills,
    lifeAreas,
  });

  const forgeScore = calculateForgeScore({
    sessions,
    skills,
    weeklyReviewCompleted: Boolean(review),
  });

  const forgeHealth =
    calculateForgeHealthScore({
      sessions,
      skills,
      weeklyReviewCompleted:
        Boolean(review),
    });

  // 2. Momentum and identity

  const momentum = calculateMomentum({
    progress,
    assessment,
  });

  const identity =
    calculateIdentityProgress({
      sessions,
      skills,
    });

  // 3. Memory and coaching

  const memory = buildMemory({
    progress,
    momentum,
    identity,
  });

  const coach = generateForgeCoach({
    progress,
    assessment,
  });

  // 4. Narrative and synthesis

  const narrative =
    buildWeeklyNarrative({
      vision,
      identity,
      momentum,
      progress,
      coach,
      achievements,
      review,
    });

  const insight = buildForgeInsight({
    vision,
    progress,
    momentum,
    forgeScore,
    forgeHealth,
    identity,
    coach,
    narrative,
  });

  // 5. History and advisor

  const history = buildHistory({
    achievements,
    narrativeTitle: narrative.title,
    northStar:
      vision?.north_star,
  });

  const advisor =
    buildAdvisorBriefing({
      vision,
      progress,
      momentum,
      identity,
      coach,
      insight,
      memory,
      narrative,
      history,
    });

  // 6. Intelligence and evidence

  const intelligence =
    buildIntelligenceConclusion({
      vision,
      progress,
      momentum,
      identity,
      coach,
      insight,
      advisor,
      memory,
      history,
      narrative,
    });

  const evidence =
    createEvidenceGraph(
      buildEvidenceNodes({
        progress,
        identity,
        advisor,
      }),
    );

  // 7. Final Forge state

  return {
    vision,
    progress,
    momentum,
    forgeScore,
    forgeHealth,
    identity,
    coach,
    narrative,
    assessment,
    insight,
    history,
    memory,
    advisor,
    intelligence,
    evidence,
  };
}
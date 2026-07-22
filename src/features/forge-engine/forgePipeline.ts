import {
  calculateForgeHealthScore,
  calculateForgeScore,
  calculateIdentityProgress,
  calculateMomentum,
  calculateProgress,
  generateForgeCoach,
} from ".";


import type {
  PracticeSession,
  Skill,
  LifeArea,
} from "@/features/forge/types";

import type { WeeklyPlanAssessment } from "./planning-assessment/assessment.types";

import type { ForgeState } from "./forge.types";
import type { Vision } from "@/features/vision";
import {
  buildWeeklyNarrative,
} from "./narrative";

import type {
  AchievementSnapshot,
  WeeklyReviewSnapshot,
} from "./narrative";

import {
  buildForgeInsight,
} from "./synthesis";

import {
  buildHistory,
} from "./history";

import {
  buildMemory,
} from "./memory";

import {
  buildAdvisorBriefing,
} from "./advisor";


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
    weeklyReviewCompleted: false,
  });

  const forgeHealth =
    calculateForgeHealthScore({
      sessions,
      skills,
      weeklyReviewCompleted: false,
    });

  const identity =
    calculateIdentityProgress({
      sessions,
      skills,
    });

  const memory = buildMemory({
    progress,
    momentum,
    identity,
  });

  const coach = generateForgeCoach({
    progress,
    assessment,
  });

  const narrative = buildWeeklyNarrative({
  vision,
  identity,
  momentum,
  progress,
  coach,
  achievements,
  review,
});

  const insight =
   buildForgeInsight({
     vision,
     progress,
     momentum,
     forgeScore,
     forgeHealth,
     identity,
     coach,
     narrative,
  });

  const history = buildHistory({
  achievements,
  narrativeTitle: narrative.title,
  northStar: vision?.north_star,
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
  };
}
import type {
  EarnedAchievement,
  PracticeSession,
} from "@/features/forge/types";

import type {
  ForgeState,
} from "@/features/forge-engine";

import {
  calculateTodayProgress,
} from "@/features/today";

import {
  calculateWeekProgress,
} from "@/features/today/utils";

type BuildTodayViewModelOptions = {
  profile: {
    full_name: string | null;
  } | null;

  todaySessions: PracticeSession[];
  weekSessions: PracticeSession[];
  achievements: EarnedAchievement[];
  forge: ForgeState;
};

export function buildTodayViewModel({
  profile,
  todaySessions,
  weekSessions,
  achievements,
  forge,
}: BuildTodayViewModelOptions) {
  const todayProgress =
    calculateTodayProgress(todaySessions);

  const weekProgress =
    calculateWeekProgress(weekSessions);

  const firstName =
    profile?.full_name
      ?.split(" ")[0]
      ?.trim() || "Friend";

  return {
    hero: {
      firstName,
      advisor: forge.advisor,
      insight: forge.insight,
    },

    mission: {
      sessions: todaySessions,
    },

    coach: {
      coach: forge.coach,
    },

    story: {
      narrative: forge.narrative,
    },

    memory: {
      memories: forge.memory.strongest,
    },

    momentum: {
      score: forge.momentum.score,
      direction: forge.momentum.direction,
      consistency: forge.momentum.consistency,
      recovery: forge.momentum.recovery,
      adherence: forge.momentum.adherence,
      burnoutRisk: forge.momentum.burnoutRisk,
      message: forge.momentum.message,
    },

    forgeScore: {
      score: forge.forgeScore.score,
      breakdown: forge.forgeScore.breakdown,
    },

    progress: {
      todayCompleted: todayProgress.completed,
      todayTotal: todayProgress.total,
      todayPercentage: todayProgress.percentage,
      weekCompleted: weekProgress.completed,
      weekTotal: weekProgress.total,
    },

    identity: {
      identity: forge.identity,
    },

    achievement: {
      achievement: achievements[0] ?? null,
    },
  };
}

export type TodayViewModel =
  ReturnType<typeof buildTodayViewModel>;
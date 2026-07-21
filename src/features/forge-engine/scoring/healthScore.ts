import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type {
  ForgeHealthScoreResult,
} from "../types";

type CalculateForgeHealthScoreOptions = {
  sessions: PracticeSession[];
  skills?: Skill[];
  weeklyReviewCompleted?: boolean;
};

export function calculateForgeHealthScore({
  sessions,
  skills = [],
  weeklyReviewCompleted = false,
}: CalculateForgeHealthScoreOptions): ForgeHealthScoreResult {
  const includedSessions = sessions.filter(
    (session) => session.status !== "skipped",
  );

  const completedSessions = includedSessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed === true,
  );

  const completionRate =
    includedSessions.length === 0
      ? 0
      : Math.round(
          (completedSessions.length /
            includedSessions.length) *
            100,
        );

  const completedDates = new Set(
    completedSessions.map(
      (session) => session.scheduled_date,
    ),
  );

  const scheduledDates = new Set(
    includedSessions.map(
      (session) => session.scheduled_date,
    ),
  );

  const consistencyRate =
    scheduledDates.size === 0
      ? 0
      : Math.round(
          (completedDates.size /
            scheduledDates.size) *
            100,
        );

  const reflectedSessions =
    completedSessions.filter(
      (session) =>
        Boolean(session.reflection?.trim()),
    ).length;

  const reflectionRate =
    completedSessions.length === 0
      ? 0
      : Math.round(
          (reflectedSessions /
            completedSessions.length) *
            100,
        );

  const balanceRate = calculateBalanceScore(
    completedSessions,
    skills,
  );

  const reviewRate =
    weeklyReviewCompleted ? 100 : 0;

  const breakdown = {
    completion: Math.round(
      completionRate * 0.4,
    ),
    consistency: Math.round(
      consistencyRate * 0.3,
    ),
    balance: Math.round(
      balanceRate * 0.15,
    ),
    reflection: Math.round(
      reflectionRate * 0.1,
    ),
    review: Math.round(
      reviewRate * 0.05,
    ),
  };

  const score = clamp(
    breakdown.completion +
      breakdown.consistency +
      breakdown.balance +
      breakdown.reflection +
      breakdown.review,
    0,
    100,
  );

  return {
    score,
    grade: getForgeGrade(score),
    breakdown,
  };
}

function calculateBalanceScore(
  completedSessions: PracticeSession[],
  skills: Skill[],
): number {
  if (completedSessions.length === 0) {
    return 0;
  }

  const skillById = new Map(
    skills.map((skill) => [skill.id, skill]),
  );

  const activeAreaIds = new Set(
    skills
      .filter((skill) => !skill.archived)
      .map((skill) => skill.life_area_id)
      .filter(
        (areaId): areaId is string =>
          Boolean(areaId),
      ),
  );

  if (activeAreaIds.size === 0) {
    return 0;
  }

  const practicedAreaIds = new Set<string>();

  for (const session of completedSessions) {
    if (!session.skill_id) {
      continue;
    }

    const areaId =
      skillById.get(session.skill_id)
        ?.life_area_id;

    if (areaId) {
      practicedAreaIds.add(areaId);
    }
  }

  return Math.round(
    (practicedAreaIds.size /
      activeAreaIds.size) *
      100,
  );
}

function getForgeGrade(
  score: number,
): ForgeHealthScoreResult["grade"] {
  if (score >= 95) {
    return "Master";
  }

  if (score >= 85) {
    return "Craftsman";
  }

  if (score >= 70) {
    return "Builder";
  }

  return "Apprentice";
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}
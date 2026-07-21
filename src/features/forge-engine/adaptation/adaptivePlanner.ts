import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type {
  AdaptivePlan,
  AdaptationConfidence,
  AdaptationSuggestion,
  DayPerformance,
  SkillAdaptation,
} from "./adaptation.types";

type PlannerOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
};

const WEEK_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export function buildAdaptivePlan({
  sessions,
  skills,
}: PlannerOptions): AdaptivePlan {
  const skillAdaptations: SkillAdaptation[] = [];
  const suggestions: AdaptationSuggestion[] = [];

  for (const skill of skills) {
    if (skill.archived) {
      continue;
    }

    const skillSessions = sessions.filter(
      (session) => session.skill_id === skill.id,
    );

    const includedSessions = skillSessions.filter(
      (session) => session.status !== "skipped",
    );

    const completedSessions = skillSessions.filter(
      isCompletedSession,
    );

    const dayPerformance =
      calculateDayPerformance(skillSessions);

    const recommendedDays = recommendDays({
      currentDays: skill.preferred_days,
      targetFrequency: skill.target_frequency,
      dayPerformance,
    });

    const confidence = calculateConfidence(
      includedSessions.length,
    );

    const reasons = buildReasons({
      currentDays: skill.preferred_days,
      recommendedDays,
      dayPerformance,
      sessionCount: includedSessions.length,
    });

    skillAdaptations.push({
      skillId: skill.id,
      skillName: skill.name,
      currentPreferredDays: [...skill.preferred_days],
      recommendedDays,
      confidence,
      reasons,
      dayPerformance,
    });

    addWorkloadSuggestions({
      skill,
      includedSessions,
      completedSessions,
      suggestions,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    skills: skillAdaptations,
    suggestions,
  };
}

/**
 * Backward-compatible name used by the existing Skills page.
 */
export function analyzeAdaptivePlanning(
  options: PlannerOptions,
): AdaptivePlan {
  return buildAdaptivePlan(options);
}

function calculateDayPerformance(
  sessions: PracticeSession[],
): DayPerformance[] {
  return WEEK_DAYS.map((day) => {
    const daySessions = sessions.filter(
      (session) =>
        getWeekdayKey(session.scheduled_date) === day,
    );

    const includedSessions = daySessions.filter(
      (session) => session.status !== "skipped",
    );

    const completedSessions =
      daySessions.filter(isCompletedSession);

    return {
      day,
      scheduledSessions: includedSessions.length,
      completedSessions: completedSessions.length,
      completionRate:
        includedSessions.length === 0
          ? 0
          : Math.round(
              (completedSessions.length /
                includedSessions.length) *
                100,
            ),
    };
  }).filter(
    (performance) =>
      performance.scheduledSessions > 0,
  );
}

function recommendDays({
  currentDays,
  targetFrequency,
  dayPerformance,
}: {
  currentDays: string[];
  targetFrequency: number;
  dayPerformance: DayPerformance[];
}): string[] {
  if (dayPerformance.length === 0) {
    return [...currentDays];
  }

  const rankedDays = [...dayPerformance].sort(
    (first, second) =>
      second.completionRate -
        first.completionRate ||
      second.completedSessions -
        first.completedSessions ||
      getDayIndex(first.day) -
        getDayIndex(second.day),
  );

  const desiredCount = Math.max(
    1,
    Math.min(
      targetFrequency,
      WEEK_DAYS.length,
    ),
  );

  const recommended = rankedDays
    .slice(0, desiredCount)
    .map((performance) => performance.day);

  for (const currentDay of currentDays) {
    if (recommended.length >= desiredCount) {
      break;
    }

    if (!recommended.includes(currentDay)) {
      recommended.push(currentDay);
    }
  }

  for (const day of WEEK_DAYS) {
    if (recommended.length >= desiredCount) {
      break;
    }

    if (!recommended.includes(day)) {
      recommended.push(day);
    }
  }

  return recommended.sort(
    (first, second) =>
      getDayIndex(first) - getDayIndex(second),
  );
}

function calculateConfidence(
  sessionCount: number,
): AdaptationConfidence {
  if (sessionCount >= 12) {
    return "high";
  }

  if (sessionCount >= 6) {
    return "medium";
  }

  return "low";
}

function buildReasons({
  currentDays,
  recommendedDays,
  dayPerformance,
  sessionCount,
}: {
  currentDays: string[];
  recommendedDays: string[];
  dayPerformance: DayPerformance[];
  sessionCount: number;
}): string[] {
  if (sessionCount < 3) {
    return [];
  }

  const reasons: string[] = [];

  const strongestDay = [...dayPerformance].sort(
    (first, second) =>
      second.completionRate -
      first.completionRate,
  )[0];

  const weakestDay = [...dayPerformance]
    .filter(
      (performance) =>
        performance.scheduledSessions > 0,
    )
    .sort(
      (first, second) =>
        first.completionRate -
        second.completionRate,
    )[0];

  if (strongestDay) {
    reasons.push(
      `${capitalize(
        strongestDay.day,
      )} has produced your strongest follow-through at ${strongestDay.completionRate}%.`,
    );
  }

  if (
    weakestDay &&
    strongestDay &&
    weakestDay.day !== strongestDay.day &&
    weakestDay.completionRate <
      strongestDay.completionRate
  ) {
    reasons.push(
      `${capitalize(
        weakestDay.day,
      )} has produced lower completion at ${weakestDay.completionRate}%.`,
    );
  }

  if (!sameDays(currentDays, recommendedDays)) {
    reasons.push(
      "The recommended schedule favors the days on which you have completed practices most consistently.",
    );
  }

  return reasons;
}

function addWorkloadSuggestions({
  skill,
  includedSessions,
  completedSessions,
  suggestions,
}: {
  skill: Skill;
  includedSessions: PracticeSession[];
  completedSessions: PracticeSession[];
  suggestions: AdaptationSuggestion[];
}) {
  if (includedSessions.length === 0) {
    return;
  }

  const completionRate =
    completedSessions.length /
    includedSessions.length;

  const averageDuration =
    completedSessions.reduce(
      (sum, session) =>
        sum +
        (session.duration_minutes ?? 0),
      0,
    ) / Math.max(completedSessions.length, 1);

  if (completionRate < 0.5) {
    suggestions.push({
      skillId: skill.id,
      skillName: skill.name,
      title: "Reduce weekly workload",
      explanation: `You completed ${Math.round(
        completionRate * 100,
      )}% of your recent ${
        skill.name
      } sessions. A smaller weekly commitment may make consistency easier to rebuild.`,
      confidence: getNumericConfidence(
        includedSessions.length,
      ),
      changes: {
        frequency: Math.max(
          1,
          skill.target_frequency - 1,
        ),
      },
    });
  }

  if (
    averageDuration > 90 &&
    completionRate < 0.75
  ) {
    suggestions.push({
      skillId: skill.id,
      skillName: skill.name,
      title: "Shorten sessions",
      explanation:
        "Long sessions appear to coincide with lower follow-through. Try shorter sessions before increasing the workload again.",
      confidence: getNumericConfidence(
        includedSessions.length,
      ),
      changes: {
        duration: 60,
      },
    });
  }
}

function isCompletedSession(
  session: PracticeSession,
): boolean {
  return (
    session.completed === true ||
    session.status === "completed"
  );
}

function getWeekdayKey(
  dateValue: string,
): string {
  const [year, month, day] = dateValue
    .slice(0, 10)
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  const keys = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  return keys[date.getDay()];
}

function getDayIndex(
  day: string,
): number {
  const index = WEEK_DAYS.indexOf(
    day as (typeof WEEK_DAYS)[number],
  );

  return index === -1
    ? WEEK_DAYS.length
    : index;
}

function sameDays(
  first: string[],
  second: string[],
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  return first.every(
    (day, index) => day === second[index],
  );
}

function capitalize(
  value: string,
): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getNumericConfidence(
  sessionCount: number,
): number {
  if (sessionCount >= 12) {
    return 0.9;
  }

  if (sessionCount >= 6) {
    return 0.75;
  }

  return 0.55;
}
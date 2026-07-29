import type {
  PracticeSession,
} from "@/features/forge/types";

import type {
  PracticeTrendAnalysis,
  TrendDirection,
  TrendMetric,
} from "./trend.types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

type BuildPracticeTrendAnalysisOptions = {
  sessions: PracticeSession[];
  now?: Date;
};

export function buildPracticeTrendAnalysis({
  sessions,
  now = new Date(),
}: BuildPracticeTrendAnalysisOptions): PracticeTrendAnalysis {
  const currentEnd = endOfDay(now);
  const currentStart = startOfDay(
    new Date(currentEnd.getTime() - 6 * DAY_IN_MS),
  );

  const previousEnd = endOfDay(
    new Date(currentStart.getTime() - DAY_IN_MS),
  );

  const previousStart = startOfDay(
    new Date(previousEnd.getTime() - 6 * DAY_IN_MS),
  );

  const currentSessions = sessions.filter((session) =>
    isWithinPeriod(
      session.scheduled_date,
      currentStart,
      currentEnd,
    ),
  );

  const previousSessions = sessions.filter((session) =>
    isWithinPeriod(
      session.scheduled_date,
      previousStart,
      previousEnd,
    ),
  );

  const currentScheduled = currentSessions.length;
  const previousScheduled = previousSessions.length;

  const currentCompleted = currentSessions.filter(
    (session) => session.completed,
  ).length;

  const previousCompleted = previousSessions.filter(
    (session) => session.completed,
  ).length;

  const currentReflected = currentSessions.filter(
    hasReflection,
  ).length;

  const previousReflected = previousSessions.filter(
    hasReflection,
  ).length;

  const currentCompletionRate = calculateRate(
    currentCompleted,
    currentScheduled,
  );

  const previousCompletionRate = calculateRate(
    previousCompleted,
    previousScheduled,
  );

  const currentReflectionRate = calculateRate(
    currentReflected,
    currentCompleted,
  );

  const previousReflectionRate = calculateRate(
    previousReflected,
    previousCompleted,
  );

  const scheduledSessions = buildTrendMetric(
    currentScheduled,
    previousScheduled,
  );

  const completedSessions = buildTrendMetric(
    currentCompleted,
    previousCompleted,
  );

  const completionRate = buildTrendMetric(
    currentCompletionRate,
    previousCompletionRate,
    5,
  );

  const reflectedSessions = buildTrendMetric(
    currentReflected,
    previousReflected,
  );

  const reflectionRate = buildTrendMetric(
    currentReflectionRate,
    previousReflectionRate,
    5,
  );

  const evidenceCount =
    currentScheduled + previousScheduled;

  return {
    generatedAt: now.toISOString(),

    currentPeriod: {
      start: toIsoDate(currentStart),
      end: toIsoDate(currentEnd),
    },

    previousPeriod: {
      start: toIsoDate(previousStart),
      end: toIsoDate(previousEnd),
    },

    scheduledSessions,
    completedSessions,
    completionRate,
    reflectedSessions,
    reflectionRate,

    overallDirection: determineOverallDirection({
      completionRate,
      completedSessions,
      reflectionRate,
      evidenceCount,
    }),

    confidence: calculateConfidence(evidenceCount),
    evidenceCount,
  };
}

function buildTrendMetric(
  current: number,
  previous: number,
  stableThreshold = 1,
): TrendMetric {
  const change = round(current - previous);

  const percentChange =
    previous === 0
      ? current === 0
        ? 0
        : null
      : round(((current - previous) / previous) * 100);

  return {
    current: round(current),
    previous: round(previous),
    change,
    percentChange,
    direction: determineDirection(
      current,
      previous,
      stableThreshold,
    ),
  };
}

function determineDirection(
  current: number,
  previous: number,
  stableThreshold: number,
): TrendDirection {
  if (current === 0 && previous === 0) {
    return "insufficient-data";
  }

  const difference = current - previous;

  if (Math.abs(difference) < stableThreshold) {
    return "stable";
  }

  return difference > 0
    ? "improving"
    : "declining";
}

function determineOverallDirection({
  completionRate,
  completedSessions,
  reflectionRate,
  evidenceCount,
}: {
  completionRate: TrendMetric;
  completedSessions: TrendMetric;
  reflectionRate: TrendMetric;
  evidenceCount: number;
}): TrendDirection {
  if (evidenceCount < 3) {
    return "insufficient-data";
  }

  const scores = [
    directionScore(completionRate.direction),
    directionScore(completedSessions.direction),
    directionScore(reflectionRate.direction),
  ];

  const total = scores.reduce(
    (sum, score) => sum + score,
    0,
  );

  if (total >= 2) {
    return "improving";
  }

  if (total <= -2) {
    return "declining";
  }

  return "stable";
}

function directionScore(
  direction: TrendDirection,
): number {
  switch (direction) {
    case "improving":
      return 1;

    case "declining":
      return -1;

    default:
      return 0;
  }
}

function calculateConfidence(
  evidenceCount: number,
): number {
  if (evidenceCount === 0) {
    return 0;
  }

  return Math.min(
    95,
    Math.round(25 + evidenceCount * 5),
  );
}

function calculateRate(
  numerator: number,
  denominator: number,
): number {
  if (denominator === 0) {
    return 0;
  }

  return round((numerator / denominator) * 100);
}

function hasReflection(
  session: PracticeSession,
): boolean {
  return Boolean(session.reflection?.trim());
}

function isWithinPeriod(
  scheduledDate: string,
  start: Date,
  end: Date,
): boolean {
  const date = startOfDay(
    new Date(`${scheduledDate}T00:00:00`),
  );

  return date >= start && date <= end;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
import { DAYS, type PracticeSession } from "./types";
import type { CandidateDay } from "./planner.types";

const DAY_INDEX = new Map<string, number>(
  DAYS.map((day, index) => [day, index]),
);

export function getPreferredDayIndexes(
  preferredDays: string[],
): number[] {
  const indexes = preferredDays
    .map((day) => DAY_INDEX.get(day))
    .filter((index): index is number => index !== undefined);

  return [...new Set(indexes)];
}

export function createDailyLoad(
  sessions: PracticeSession[],
  monday: Date,
): number[] {
  const load = Array.from({ length: 7 }, () => 0);

  for (const session of sessions) {
    const sessionDate = parseDateString(session.scheduled_date);
    const difference = differenceInCalendarDays(
      sessionDate,
      monday,
    );

    if (difference >= 0 && difference <= 6) {
      load[difference] += 1;
    }
  }

  return load;
}

export function rankCandidateDays(
  preferredIndexes: number[],
  dailyLoad: number[],
  monday: Date,
): CandidateDay[] {
  const preferredSet = new Set(preferredIndexes);

  return DAYS.map((_, dayIndex) => {
    const preferred = preferredSet.has(dayIndex);
    const workload = dailyLoad[dayIndex];
    const reasons: string[] = [];

    let score = 0;

    if (preferred) {
      score += 10;
      reasons.push("Preferred day");
    } else {
      reasons.push("Fallback day");
    }

    const workloadScore = Math.max(0, 6 - workload * 2);
    score += workloadScore;

    if (workload === 0) {
      reasons.push("No other practices scheduled");
    } else if (workload === 1) {
      reasons.push("Light daily workload");
    } else {
      reasons.push("Existing daily workload");
    }

    return {
      dayIndex,
      date: addDays(monday, dayIndex),
      score,
      workload,
      sessionCount: workload,
      preferred,
      reasons,
    };
  }).sort((a, b) => {
    return (
      b.score - a.score ||
      a.workload - b.workload ||
      a.dayIndex - b.dayIndex
    );
  });
}

export function getIntensity(
  difficulty: number,
): PracticeSession["intensity"] {
  if (difficulty >= 4) {
    return "high";
  }

  if (difficulty <= 1) {
    return "recovery";
  }

  return "deliberate";
}

export function parseDateString(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);

  return formatDate(result);
}

export function differenceInCalendarDays(
  laterDate: Date,
  earlierDate: Date,
): number {
  const laterUtc = Date.UTC(
    laterDate.getFullYear(),
    laterDate.getMonth(),
    laterDate.getDate(),
  );

  const earlierUtc = Date.UTC(
    earlierDate.getFullYear(),
    earlierDate.getMonth(),
    earlierDate.getDate(),
  );

  return Math.round(
    (laterUtc - earlierUtc) / 86_400_000,
  );
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(Math.max(value, minimum), maximum);
}
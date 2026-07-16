import type { PracticeSession } from "@/features/forge/types";
import type { TodayProgress } from "../types";

export function calculateTodayProgress(
  sessions: PracticeSession[],
): TodayProgress {
  const total = sessions.filter(
    (session) => session.status !== "skipped",
  ).length;

  const completed = sessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed === true,
  ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return {
    completed,
    total,
    percentage,
  };
}

export function getGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

const DAILY_QUOTES = [
  "Excellence is forged one deliberate practice at a time.",
  "Every repetition shapes the person you become.",
  "Consistency outlives motivation.",
  "Small disciplines become extraordinary lives.",
  "Progress is built quietly, then revealed all at once.",
  "Practice is a vote for the person you are becoming.",
  "A meaningful life is forged through repeated attention.",
] as const;

export function getDailyQuote(date = new Date()): string {
  const startOfYear = new Date(date.getFullYear(), 0, 0);

  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) /
      86_400_000,
  );

  return DAILY_QUOTES[
    dayOfYear % DAILY_QUOTES.length
  ];
}
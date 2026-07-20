import type { PracticeSession } from "@/features/forge/types";

type ProgressSummary = {
  completed: number;
  total: number;
};

export function calculateWeekProgress(
  sessions: PracticeSession[],
): ProgressSummary {
  const includedSessions = sessions.filter(
    (session) => session.status !== "skipped",
  );

  const completed = includedSessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed,
  ).length;

  return {
    completed,
    total: includedSessions.length,
  };
}
import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";
import type { ForgeScoreResult } from "../types";
import { SCORE } from "./weights";

type CalculateForgeScoreOptions = {
  sessions: PracticeSession[];
  skills?: Skill[];
  weeklyReviewCompleted?: boolean;
};

export function calculateForgeScore({
  sessions,
  skills = [],
  weeklyReviewCompleted = false,
}: CalculateForgeScoreOptions): ForgeScoreResult {
  const skillById = new Map(
    skills.map((skill) => [skill.id, skill]),
  );

  const breakdown = {
    consistency: 0,
    difficulty: 0,
    duration: 0,
    reflection: 0,
    review: 0,
    penalties: 0,
  };

  for (const session of sessions) {
    const completed =
      session.status === "completed" ||
      session.completed === true;

    if (!completed) {
      continue;
    }

    breakdown.consistency += SCORE.session;

    const skill = session.skill_id
      ? skillById.get(session.skill_id)
      : undefined;

    if ((skill?.difficulty ?? 0) >= 4) {
      breakdown.difficulty += SCORE.difficult;
    }

    if ((session.duration_minutes ?? 0) >= 60) {
      breakdown.duration += SCORE.longSession;
    }

    if (session.reflection?.trim()) {
      breakdown.reflection += SCORE.reflection;
    }
  }

  if (weeklyReviewCompleted) {
    breakdown.review += SCORE.weeklyReview;
  }

  const score =
    breakdown.consistency +
    breakdown.difficulty +
    breakdown.duration +
    breakdown.reflection +
    breakdown.review +
    breakdown.penalties;

  return {
    score: Math.max(0, score),
    breakdown,
  };
}
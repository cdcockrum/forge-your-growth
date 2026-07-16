import type { CandidateDay } from "./planner.types";
import type { Skill } from "./types";

/**
 * Scores a possible day for a particular skill.
 *
 * Higher scores represent better placements. This function remains
 * deterministic so the same inputs always produce the same plan.
 */
export function scoreCandidateDay(
  candidate: CandidateDay,
  skill: Skill,
): CandidateDay {
  let score = 0;
  const reasons: string[] = [];

  if (candidate.preferred) {
    score += 40;
    reasons.push("Preferred day");
  } else {
    reasons.push("Available fallback day");
  }

  const workloadScore = Math.max(
    0,
    24 - candidate.workload * 8,
  );

  score += workloadScore;

  if (candidate.workload === 0) {
    reasons.push("Open schedule");
  } else if (candidate.workload === 1) {
    reasons.push("Light workload");
  } else {
    reasons.push("Balances existing workload");
  }

  if (skill.difficulty >= 4) {
    if (candidate.workload === 0) {
      score += 15;
      reasons.push("Protects demanding practice");
    } else {
      score -= candidate.workload * 4;
    }
  }

  if (skill.session_minutes >= 60) {
    if (candidate.workload === 0) {
      score += 10;
      reasons.push("Creates space for a long session");
    } else {
      score -= candidate.workload * 3;
    }
  }

  if (skill.session_minutes <= 20) {
    score += 3;
    reasons.push("Short practice fits this day");
  }

  return {
    ...candidate,
    score,
    reasons,
  };
}
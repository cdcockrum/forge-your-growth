import type { ProgressSummary } from "../progress/progress.types";
import type { WeeklyPlanAssessment } from "../planning-assessment/assessment.types";
import type { MomentumResult } from "./momentum.types";

type Options = {
  progress: ProgressSummary;
  assessment?: WeeklyPlanAssessment;
};

export function calculateMomentum({
  progress,
  assessment,
}: Options): MomentumResult {

  const consistency =
    progress.completionRate;

  const recovery =
    assessment?.label === "demanding"
      ? 55
      : 90;

  const adherence =
    Math.min(
      100,
      progress.currentStreak * 8,
    );

  const score = Math.round(
    consistency * 0.45 +
    recovery * 0.25 +
    adherence * 0.30,
  );

  const direction =
    score >= 80
      ? "rising"
      : score >= 60
      ? "stable"
      : "falling";

  const burnoutRisk =
    assessment?.label === "demanding"
      ? "high"
      : recovery < 70
      ? "moderate"
      : "low";

  return {
    score,
    direction,
    burnoutRisk,
    consistency,
    recovery,
    adherence,
    message: buildMessage(
      direction,
      burnoutRisk,
    ),
  };
}

function buildMessage(
  direction: MomentumResult["direction"],
  burnout: MomentumResult["burnoutRisk"],
) {

  if (burnout === "high") {
    return "Protect recovery before increasing workload.";
  }

  if (direction === "rising") {
    return "Momentum is building. Stay consistent.";
  }

  if (direction === "stable") {
    return "Small daily wins will keep momentum alive.";
  }

  return "Reduce friction and rebuild consistency.";
}
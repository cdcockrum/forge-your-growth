import type {
  ProgressSummary,
} from "../progress";

import type {
  WeeklyPlanAssessment,
} from "../planning-assessment/assessment.types";

import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "./coach.types";

type GenerateForgeCoachOptions = {
  progress: ProgressSummary;
  assessment?: WeeklyPlanAssessment;
};

export function generateForgeCoach({
  progress,
  assessment,
}: GenerateForgeCoachOptions): ForgeCoachResult {
  const recommendations: CoachRecommendation[] = [];

  if (progress.totalSessions === 0) {
    recommendations.push({
      id: "create-plan",
      title: "Create your first rhythm",
      message:
        "There are no practices scheduled yet. Begin with one manageable commitment.",
      actionType: "adjust_plan",
      actionLabel: "Plan your week",
    });
  }

  if (
    progress.totalSessions > 0 &&
    progress.completionRate < 40
  ) {
    recommendations.push({
      id: "simplify-plan",
      title: "Reduce the load",
      message:
        "Your current plan may be asking for too much. Protect momentum by making the next step smaller.",
      actionType: "adjust_plan",
      actionLabel: "Adjust the plan",
    });
  }

  if (
    progress.totalSessions > 0 &&
    progress.completionRate >= 40 &&
    progress.completionRate < 75
  ) {
    recommendations.push({
      id: "complete-one-practice",
      title: "Make one promise count",
      message:
        "Choose one meaningful practice and complete it before adding more.",
      actionType: "practice",
      actionLabel: "Open Today",
    });
  }

  if (progress.currentStreak >= 7) {
    recommendations.push({
      id: "protect-rhythm",
      title: "Protect the rhythm",
      message: `You have practiced for ${progress.currentStreak} consecutive days. Keep today simple enough to continue.`,
      actionType: "maintain",
      actionLabel: "Continue",
    });
  }

  if (
    progress.neglectedSkill &&
    progress.neglectedSkill.daysSincePracticed !== null &&
    progress.neglectedSkill.daysSincePracticed >= 7
  ) {
    recommendations.push({
      id: "neglected-skill",
      title: "Return to a neglected skill",
      message: `${progress.neglectedSkill.name} has not been practiced for ${progress.neglectedSkill.daysSincePracticed} days.`,
      actionType: "practice",
      actionLabel: "Schedule a practice",
    });
  }

  if (
    assessment &&
    hasAssessmentConcern(assessment)
  ) {
    recommendations.push({
      id: "review-weekly-plan",
      title: "Review the plan",
      message:
        "Your weekly assessment suggests that part of the plan may need adjustment.",
      actionType: "adjust_plan",
      actionLabel: "Review the plan",
    });
  }

  if (
    progress.completedSessions > 0 &&
    progress.completionRate >= 80
  ) {
    recommendations.push({
      id: "reflect-on-progress",
      title: "Capture what is working",
      message:
        "Your practice rhythm is strong. Take a moment to identify what made consistency possible.",
      actionType: "reflect",
      actionLabel: "Reflect",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "maintain-direction",
      title: "Continue the work",
      message:
        "Your current rhythm is sustainable. Complete the next practice with intention.",
      actionType: "maintain",
      actionLabel: "Continue",
    });
  }

  const intensity = determineIntensity(progress);

  return {
    headline: getHeadline(intensity),
    message: getMessage(progress),
    intensity,
    recommendations: recommendations.slice(0, 3),
  };
}

function determineIntensity(
  progress: ProgressSummary,
): ForgeCoachResult["intensity"] {
  if (
    progress.totalSessions > 0 &&
    progress.completionRate < 40
  ) {
    return "high";
  }

  if (
    progress.completionRate < 75 ||
    progress.neglectedSkill !== null
  ) {
    return "moderate";
  }

  return "low";
}

function getHeadline(
  intensity: ForgeCoachResult["intensity"],
): string {
  if (intensity === "high") {
    return "Rebuild momentum";
  }

  if (intensity === "moderate") {
    return "Refine the rhythm";
  }

  return "Protect what is working";
}

function getMessage(
  progress: ProgressSummary,
): string {
  if (progress.totalSessions === 0) {
    return "The forge is ready. Begin with one clear commitment.";
  }

  if (progress.completionRate >= 80) {
    return "You are following through consistently. Keep the next step focused and sustainable.";
  }

  if (progress.completionRate >= 50) {
    return "Progress is forming. A few deliberate completions can strengthen the week.";
  }

  return "Do not chase the entire plan today. Complete one meaningful practice and rebuild from there.";
}

function hasAssessmentConcern(
  assessment: WeeklyPlanAssessment,
): boolean {
  const value = assessment as unknown as Record<
    string,
    unknown
  >;

  return (
    value.needsAdjustment === true ||
    value.overloaded === true ||
    value.requiresAttention === true
  );
}
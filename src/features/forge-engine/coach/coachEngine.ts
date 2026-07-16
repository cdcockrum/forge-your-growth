import type { ProgressSummary } from "../progress/progress.types";
import type { SkillAdaptation } from "../adaptation/adaptation.types";
import type { WeeklyPlanAssessment } from "../planning-assessment/assessment.types";
import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "./coach.types";

type GenerateForgeCoachOptions = {
  progress: ProgressSummary;
  adaptations?: SkillAdaptation[];
  assessment?: WeeklyPlanAssessment;
  weeklyReflectionCompleted?: boolean;
};

export function generateForgeCoach({
  progress,
  adaptations = [],
  assessment,
  weeklyReflectionCompleted = false,
}: GenerateForgeCoachOptions): ForgeCoachResult {
  const recommendations: CoachRecommendation[] = [];

  addConsistencyRecommendation(
    recommendations,
    progress,
  );

  addNeglectedSkillRecommendation(
    recommendations,
    progress,
  );

  addAdaptiveRecommendation(
    recommendations,
    adaptations,
  );

  addRecoveryRecommendation(
    recommendations,
    assessment,
  );

  addReflectionRecommendation(
    recommendations,
    weeklyReflectionCompleted,
  );

  addMomentumRecommendation(
    recommendations,
    progress,
  );

  const prioritized = recommendations
    .sort(compareRecommendations)
    .slice(0, 4);

  return {
    headline: getCoachHeadline(progress, assessment),
    summary: getCoachSummary(progress, prioritized),
    recommendations: prioritized,
  };
}

function addConsistencyRecommendation(
  recommendations: CoachRecommendation[],
  progress: ProgressSummary,
) {
  if (
    progress.totalSessions >= 4 &&
    progress.completionRate < 50
  ) {
    recommendations.push({
      id: "reduce-plan-load",
      title: "Make the plan easier to complete.",
      description:
        `Your completion rate is ${progress.completionRate}%. ` +
        "Reduce the frequency or duration of one demanding practice next week.",
      priority: "high",
      actionType: "adjust_plan",
    });

    return;
  }

  if (progress.completionRate >= 85) {
    recommendations.push({
      id: "protect-consistency",
      title: "Protect the rhythm that is working.",
      description:
        `You completed ${progress.completionRate}% of your planned practices. ` +
        "Avoid adding unnecessary volume while this pattern is strong.",
      priority: "low",
      actionType: "maintain",
    });
  }
}

function addNeglectedSkillRecommendation(
  recommendations: CoachRecommendation[],
  progress: ProgressSummary,
) {
  const skill = progress.neglectedSkill;

  if (
    !skill ||
    skill.daysSincePracticed === null ||
    skill.daysSincePracticed < 7
  ) {
    return;
  }

  recommendations.push({
    id: `resume-${skill.skillId}`,
    title: `Return to ${skill.name}.`,
    description:
      `${skill.daysSincePracticed} days have passed since its last completed practice. ` +
      "Schedule one short, low-friction session.",
    priority:
      skill.daysSincePracticed >= 14
        ? "high"
        : "medium",
    actionType: "practice",
    skillId: skill.skillId,
    skillName: skill.name,
  });
}

function addAdaptiveRecommendation(
  recommendations: CoachRecommendation[],
  adaptations: SkillAdaptation[],
) {
  const strongestRecommendation = adaptations
    .filter(
      (adaptation) =>
        adaptation.confidence !== "low" &&
        !sameDays(
          adaptation.currentPreferredDays,
          adaptation.recommendedDays,
        ),
    )
    .sort(
      (first, second) =>
        confidenceWeight(second.confidence) -
        confidenceWeight(first.confidence),
    )[0];

  if (!strongestRecommendation) {
    return;
  }

  recommendations.push({
    id: `adapt-${strongestRecommendation.skillId}`,
    title: `Adjust ${strongestRecommendation.skillName}'s practice days.`,
    description:
      `Forge has ${strongestRecommendation.confidence} confidence that ` +
      `${formatDays(
        strongestRecommendation.recommendedDays,
      )} will produce better follow-through.`,
    priority:
      strongestRecommendation.confidence === "high"
        ? "high"
        : "medium",
    actionType: "adjust_plan",
    skillId: strongestRecommendation.skillId,
    skillName: strongestRecommendation.skillName,
  });
}

function addRecoveryRecommendation(
  recommendations: CoachRecommendation[],
  assessment?: WeeklyPlanAssessment,
) {
  if (!assessment) {
    return;
  }

  if (assessment.label === "demanding") {
    recommendations.push({
      id: "protect-recovery",
      title: "Protect recovery this week.",
      description:
        "The current plan is demanding. Remove, shorten, or separate one high-intensity session.",
      priority: "high",
      actionType: "recover",
    });

    return;
  }

  const recoveryIssue = assessment.items.some(
    (item) =>
      item.id === "recovery-spacing" ||
      item.id === "daily-overload",
  );

  if (recoveryIssue) {
    recommendations.push({
      id: "improve-recovery-spacing",
      title: "Create more space between demanding sessions.",
      description:
        "Your weekly assessment found concentrated workload. Move one difficult practice to a lighter day.",
      priority: "medium",
      actionType: "recover",
    });
  }
}

function addReflectionRecommendation(
  recommendations: CoachRecommendation[],
  weeklyReflectionCompleted: boolean,
) {
  if (weeklyReflectionCompleted) {
    return;
  }

  recommendations.push({
    id: "complete-reflection",
    title: "Complete the weekly reflection.",
    description:
      "Capture what worked, what created friction, and what next week should emphasize.",
    priority: "medium",
    actionType: "reflect",
  });
}

function addMomentumRecommendation(
  recommendations: CoachRecommendation[],
  progress: ProgressSummary,
) {
  if (progress.currentStreak < 5) {
    return;
  }

  recommendations.push({
    id: "maintain-streak",
    title: `Preserve your ${progress.currentStreak}-day rhythm.`,
    description:
      "Choose one manageable practice today rather than increasing intensity.",
    priority: "low",
    actionType: "maintain",
  });
}

function getCoachHeadline(
  progress: ProgressSummary,
  assessment?: WeeklyPlanAssessment,
): string {
  if (assessment?.label === "demanding") {
    return "Progress needs recovery to remain sustainable.";
  }

  if (progress.completionRate >= 85) {
    return "Your practice rhythm is working.";
  }

  if (
    progress.totalSessions >= 4 &&
    progress.completionRate < 50
  ) {
    return "The plan needs to become easier to follow.";
  }

  if (progress.currentStreak >= 7) {
    return "Consistency is becoming part of your identity.";
  }

  return "Keep the next step deliberate and manageable.";
}

function getCoachSummary(
  progress: ProgressSummary,
  recommendations: CoachRecommendation[],
): string {
  if (progress.totalSessions === 0) {
    return "Complete a few practices and Forge will begin producing personalized guidance.";
  }

  const highPriorityCount = recommendations.filter(
    (item) => item.priority === "high",
  ).length;

  if (highPriorityCount > 0) {
    return `${highPriorityCount} ${
      highPriorityCount === 1
        ? "priority deserves"
        : "priorities deserve"
    } attention before adding more practice volume.`;
  }

  return "Your current data suggests refinement rather than major change.";
}

function compareRecommendations(
  first: CoachRecommendation,
  second: CoachRecommendation,
): number {
  return (
    priorityWeight(second.priority) -
    priorityWeight(first.priority)
  );
}

function priorityWeight(
  priority: CoachRecommendation["priority"],
): number {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

function confidenceWeight(
  confidence: SkillAdaptation["confidence"],
): number {
  switch (confidence) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
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

function formatDays(days: string[]): string {
  if (days.length === 0) {
    return "the recommended days";
  }

  const formatted = days.map(
    (day) =>
      day.charAt(0).toUpperCase() + day.slice(1),
  );

  if (formatted.length === 1) {
    return formatted[0];
  }

  if (formatted.length === 2) {
    return `${formatted[0]} and ${formatted[1]}`;
  }

  return `${formatted
    .slice(0, -1)
    .join(", ")}, and ${formatted.at(-1)}`;
}
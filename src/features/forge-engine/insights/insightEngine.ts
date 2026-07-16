import type { ProgressSummary } from "../progress/progress.types";
import type { ProgressInsight } from "./insight.types";

type GenerateProgressInsightsOptions = {
  progress: ProgressSummary;
};

export function generateProgressInsights({
  progress,
}: GenerateProgressInsightsOptions): ProgressInsight[] {
  const insights: ProgressInsight[] = [];

  addConsistencyInsight(insights, progress);
  addStreakInsight(insights, progress);
  addStrongestSkillInsight(insights, progress);
  addNeglectedSkillInsight(insights, progress);
  addLifeBalanceInsight(insights, progress);
  addPracticeVolumeInsight(insights, progress);

  return insights.slice(0, 5);
}

function addConsistencyInsight(
  insights: ProgressInsight[],
  progress: ProgressSummary,
) {
  if (progress.totalSessions === 0) {
    insights.push({
      id: "no-sessions",
      title: "Your record begins with one practice.",
      description:
        "Complete a scheduled practice and Forge will begin identifying patterns in your progress.",
      tone: "neutral",
    });

    return;
  }

  if (progress.completionRate >= 85) {
    insights.push({
      id: "high-consistency",
      title: "Your consistency is strong.",
      description: `You completed ${progress.completionRate}% of your planned practices during this period.`,
      tone: "positive",
    });

    return;
  }

  if (progress.completionRate < 50) {
    insights.push({
      id: "low-consistency",
      title: "The current plan may be asking too much.",
      description: `Your completion rate is ${progress.completionRate}%. Consider reducing frequency or shortening a few sessions.`,
      tone: "attention",
    });

    return;
  }

  insights.push({
    id: "steady-consistency",
    title: "You are building a steady practice rhythm.",
    description: `You completed ${progress.completionRate}% of your planned sessions. Small adjustments may make the week more sustainable.`,
    tone: "neutral",
  });
}

function addStreakInsight(
  insights: ProgressInsight[],
  progress: ProgressSummary,
) {
  if (progress.currentStreak >= 7) {
    insights.push({
      id: "active-streak",
      title: `${progress.currentStreak} consecutive days of practice.`,
      description:
        "Your current rhythm is becoming a reliable part of your life.",
      tone: "positive",
    });

    return;
  }

  if (
    progress.longestStreak >= 5 &&
    progress.currentStreak === 0
  ) {
    insights.push({
      id: "streak-ended",
      title: "You have already proven you can build momentum.",
      description: `Your longest streak is ${progress.longestStreak} days. Begin again with one manageable practice.`,
      tone: "neutral",
    });
  }
}

function addStrongestSkillInsight(
  insights: ProgressInsight[],
  progress: ProgressSummary,
) {
  const skill = progress.strongestSkill;

  if (!skill) {
    return;
  }

  insights.push({
    id: `strongest-${skill.skillId}`,
    title: `${skill.name} is receiving your strongest investment.`,
    description: `${skill.completedSessions} completed sessions and ${formatMinutes(
      skill.completedMinutes,
    )} of deliberate practice.`,
    tone: "positive",
  });
}

function addNeglectedSkillInsight(
  insights: ProgressInsight[],
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

  insights.push({
    id: `neglected-${skill.skillId}`,
    title: `${skill.name} may need renewed attention.`,
    description: `${skill.daysSincePracticed} days have passed since its last completed practice.`,
    tone: "attention",
  });
}

function addLifeBalanceInsight(
  insights: ProgressInsight[],
  progress: ProgressSummary,
) {
  const activeAreas = progress.lifeAreas.filter(
    (area) => area.completedMinutes > 0,
  );

  if (activeAreas.length < 2) {
    return;
  }

  const dominantArea = activeAreas[0];

  if (dominantArea.percentageOfPractice >= 70) {
    insights.push({
      id: `area-dominance-${dominantArea.areaId}`,
      title: `${dominantArea.name} currently dominates your practice time.`,
      description: `${dominantArea.percentageOfPractice}% of your completed practice time went to this life area.`,
      tone: "attention",
    });

    return;
  }

  const representedAreas = activeAreas.length;

  if (representedAreas >= 3) {
    insights.push({
      id: "balanced-areas",
      title: "Your attention is distributed across several life areas.",
      description: `${representedAreas} areas received meaningful practice time during this period.`,
      tone: "positive",
    });
  }
}

function addPracticeVolumeInsight(
  insights: ProgressInsight[],
  progress: ProgressSummary,
) {
  if (progress.totalMinutes >= 600) {
    insights.push({
      id: "high-volume",
      title: "You invested more than ten hours in deliberate practice.",
      description:
        "Protect recovery and keep the schedule sustainable as your volume increases.",
      tone: "neutral",
    });
  }
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours} hours`
    : `${hours.toFixed(1)} hours`;
}
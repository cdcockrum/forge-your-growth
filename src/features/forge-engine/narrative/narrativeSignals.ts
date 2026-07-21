import type {
  NarrativeInput,
  NarrativeSignal,
} from "./narrative.types";

export function buildNarrativeSignals({
  vision,
  identity,
  momentum,
  progress,
  coach,
  achievements,
  review,
}: NarrativeInput): NarrativeSignal[] {
  const signals: NarrativeSignal[] = [];

  if (identity.strongestIdentity) {
    signals.push({
      key: "strongest-identity",
      category: "identity",
      strength: 90,
      text: `Your identity as ${getIdentityLabel(
        identity.strongestIdentity,
      )} showed the strongest evidence this week.`,
    });
  }

  if (identity.fastestDevelopingIdentity) {
    signals.push({
      key: "fastest-identity",
      category: "identity",
      strength: 85,
      text: `${getIdentityLabel(
        identity.fastestDevelopingIdentity,
      )} was your fastest-developing identity.`,
    });
  }

  if (progress.completionRate >= 80) {
    signals.push({
      key: "high-completion",
      category: "victory",
      strength: progress.completionRate,
      text: `You completed ${progress.completionRate}% of your planned practices.`,
    });
  }

  if (progress.currentStreak >= 5) {
    signals.push({
      key: "current-streak",
      category: "victory",
      strength: Math.min(
        100,
        progress.currentStreak * 10,
      ),
      text: `You maintained a ${progress.currentStreak}-day practice rhythm.`,
    });
  }

  if (progress.strongestSkill) {
    signals.push({
      key: "strongest-skill",
      category: "victory",
      strength: 80,
      text: `${progress.strongestSkill.name} received the most focused practice this week.`,
    });
  }

  if (
    progress.neglectedSkill &&
    progress.neglectedSkill.daysSincePracticed !== null &&
    progress.neglectedSkill.daysSincePracticed >= 7
  ) {
    signals.push({
      key: "neglected-skill",
      category: "obstacle",
      strength: Math.min(
        100,
        progress.neglectedSkill.daysSincePracticed * 5,
      ),
      text: `${progress.neglectedSkill.name} has gone ${progress.neglectedSkill.daysSincePracticed} days without practice.`,
    });
  }

  if (momentum.score >= 80) {
    signals.push({
      key: "strong-momentum",
      category: "momentum",
      strength: momentum.score,
      text: "Momentum remained strong throughout the week.",
    });
  }

  if (momentum.burnoutRisk === "high") {
    signals.push({
      key: "burnout-risk",
      category: "obstacle",
      strength: 95,
      text: "Your current rhythm may be demanding more recovery than you are allowing.",
    });
  }

  if (achievements.length > 0) {
    signals.push({
      key: "achievement-earned",
      category: "victory",
      strength: 75,
      text: `You earned ${achievements.length} ${
        achievements.length === 1
          ? "achievement"
          : "achievements"
      } this week.`,
    });
  }

  if (review?.wins?.trim()) {
    signals.push({
      key: "review-wins",
      category: "reflection",
      strength: 80,
      text: review.wins.trim(),
    });
  }

  if (review?.challenges?.trim()) {
    signals.push({
      key: "review-challenges",
      category: "obstacle",
      strength: 80,
      text: review.challenges.trim(),
    });
  }

  if (review?.focus_next_week?.trim()) {
    signals.push({
      key: "next-week-focus",
      category: "focus",
      strength: 90,
      text: review.focus_next_week.trim(),
    });
  }

  if (
    vision?.north_star?.trim() &&
    progress.completedSessions > 0
  ) {
    signals.push({
      key: "vision-alignment",
      category: "identity",
      strength: 85,
      text: `Your completed practices continued to support your North Star: “${vision.north_star.trim()}”`,
    });
  }

  if (coach.recommendations.length > 0) {
    signals.push({
      key: "coach-priority",
      category: "focus",
      strength: 75,
      text: coach.recommendations[0].message,
    });
  }

  return signals.sort(
    (first, second) =>
      second.strength - first.strength,
  );
}

function getIdentityLabel(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return "Identity";
  }

  const record =
    value as Record<string, unknown>;

  if (
    typeof record.identity === "object" &&
    record.identity !== null
  ) {
    const identity =
      record.identity as Record<
        string,
        unknown
      >;

    if (
      typeof identity.name === "string"
    ) {
      return identity.name;
    }

    if (
      typeof identity.key === "string"
    ) {
      return identity.key;
    }
  }

  if (
    typeof record.identity === "string"
  ) {
    return record.identity;
  }

  if (
    typeof record.name === "string"
  ) {
    return record.name;
  }

  if (
    typeof record.title === "string"
  ) {
    return record.title;
  }

  if (
    typeof record.label === "string"
  ) {
    return record.label;
  }

  return "Identity";
}
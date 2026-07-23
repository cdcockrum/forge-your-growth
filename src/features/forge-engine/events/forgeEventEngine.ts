import type {
  EarnedAchievement,
} from "@/features/forge/types";

import type {
  ForgeState,
} from "../forge.types";

import type {
  ForgeEvent,
} from "./forgeEvent.types";

type BuildForgeEventsOptions = {
  forge: ForgeState;
  date: string;
  achievements?: EarnedAchievement[];
};

function createEventId(
  date: string,
  type: ForgeEvent["type"],
  suffix: string,
): string {
  return `${date}:${type}:${suffix}`;
}

export function buildForgeEvents({
  forge,
  date,
  achievements = [],
}: BuildForgeEventsOptions): ForgeEvent[] {
  const events: ForgeEvent[] = [];

  if (forge.momentum.direction !== "stable") {
    events.push({
      id: createEventId(
        date,
        "momentum_shift",
        forge.momentum.direction,
      ),
      date,
      type: "momentum_shift",
      importance:
        forge.momentum.direction === "falling"
          ? "high"
          : "medium",
      title:
        forge.momentum.direction === "rising"
          ? "Momentum is rising"
          : "Momentum is falling",
      description:
        forge.momentum.message,
      confidence: Math.round(
        forge.advisor.confidence,
      ),
      evidence: [
        `Momentum score: ${forge.momentum.score}`,
        `Consistency: ${forge.momentum.consistency}`,
        `Adherence: ${forge.momentum.adherence}`,
      ],
    });
  }

  const strongestIdentity =
    forge.identity.strongestIdentity;

  if (strongestIdentity) {
    events.push({
      id: createEventId(
        date,
        "identity_level",
        strongestIdentity.identity.key,
      ),
      date,
      type: "identity_level",
      importance: "medium",
      title: `${strongestIdentity.identity.name} is your strongest identity`,
      description:
        `${strongestIdentity.completedSessions} completed sessions currently support this identity.`,
      confidence: Math.min(
        100,
        Math.round(
          40 +
            strongestIdentity.completedSessions *
              4,
        ),
      ),
      evidence: [
        `Level: ${strongestIdentity.level}`,
        `XP: ${strongestIdentity.xp}`,
        `Completed minutes: ${strongestIdentity.completedMinutes}`,
      ],
    });
  }

  const dominantTrait =
    forge.traits.dominantTrait;

  if (dominantTrait) {
    events.push({
      id: createEventId(
        date,
        "trait_change",
        dominantTrait.trait,
      ),
      date,
      type: "trait_change",
      importance: "medium",
      title: `${dominantTrait.trait} is your dominant trait`,
      description:
        dominantTrait.strongestSkill
          ? `${dominantTrait.strongestSkill} currently provides the strongest evidence for this trait.`
          : `${dominantTrait.evidence} completed practices support this trait.`,
      confidence: Math.min(
        100,
        Math.round(
          45 +
            dominantTrait.evidence *
              5,
        ),
      ),
      evidence: [
        `Trait score: ${dominantTrait.score}`,
        `Evidence count: ${dominantTrait.evidence}`,
      ],
    });
  }

  if (
    forge.momentum.burnoutRisk === "high"
  ) {
    events.push({
      id: createEventId(
        date,
        "recovery",
        "high-burnout-risk",
      ),
      date,
      type: "recovery",
      importance: "high",
      title: "Recovery deserves attention",
      description:
        forge.coach.message,
      confidence: Math.round(
        forge.advisor.confidence,
      ),
      evidence: [
        `Burnout risk: ${forge.momentum.burnoutRisk}`,
        `Recovery score: ${forge.momentum.recovery}`,
        `Momentum direction: ${forge.momentum.direction}`,
      ],
    });
  }

  if (forge.insight.headline) {
    events.push({
      id: createEventId(
        date,
        "insight",
        "current",
      ),
      date,
      type: "insight",
      importance: "medium",
      title: forge.insight.headline,
      description:
        forge.insight.summary,
      confidence: Math.round(
        forge.insight.confidence,
      ),
      evidence: [
        ...forge.insight.strengths,
        ...forge.insight.opportunities,
      ].slice(0, 4),
    });
  }

  for (const achievement of achievements) {
    events.push({
      id: createEventId(
        achievement.earned_at,
        "achievement",
        achievement.id,
      ),
      date: achievement.earned_at,
      type: "achievement",
      importance: "high",
      title: achievement.title,
      description:
        achievement.description ??
        "A meaningful milestone was reached.",
      confidence: 100,
      evidence: [
        achievement.key,
      ],
    });
  }

  return events.sort(
    (a, b) =>
      b.date.localeCompare(a.date),
  );
}
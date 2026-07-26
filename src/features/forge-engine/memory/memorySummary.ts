export type DerivedMemory = {
  id: string;
  type:
    | "progress"
    | "momentum"
    | "identity"
    | "focus"
    | "recovery";

  title: string;
  summary: string;
  statement: string;

  importance: number;
};

export type MemoryResult = {
  memories: DerivedMemory[];
  strongest: DerivedMemory[];
};

type BuildMemoryOptions = {
  progress: {
    completionRate: number;
    totalSessions: number;
    completedSessions: number;

    strongestSkill?: {
      name: string;
    } | null;

    neglectedSkill?: {
      name: string;
      daysSincePracticed: number | null;
    } | null;
  };

  momentum: {
    score: number;
    burnoutRisk: string;
  };

  identity: {
    strongestIdentity?: {
      identity: {
        name: string;
      };
    } | null;
  };
};

/**
 * Builds the short-lived, derived memory summary used by
 * Today, Advisor, Intelligence, and the Forge pipeline.
 *
 * This is distinct from persisted ForgeMemory records.
 */
export function buildMemory({
  progress,
  momentum,
  identity,
}: BuildMemoryOptions): MemoryResult {
  const memories: DerivedMemory[] = [];

  if (progress.totalSessions > 0) {
    memories.push({
      id: "memory-progress-completion",
      type: "progress",
      title: "Current practice rhythm",
      summary:
        `${progress.completedSessions} of ${progress.totalSessions} planned sessions were completed.`,
      statement:
        `Weekly completion is ${progress.completionRate}%.`,
      importance:
        progress.completionRate >= 75
          ? 75
          : progress.completionRate < 50
            ? 85
            : 60,
    });
  }

  if (progress.strongestSkill) {
    memories.push({
      id: "memory-strongest-skill",
      type: "focus",
      title: `${progress.strongestSkill.name} is leading`,
      summary:
        `${progress.strongestSkill.name} currently has the strongest practice evidence.`,
      statement:
        `${progress.strongestSkill.name} is your strongest active skill.`,
      importance: 75,
    });
  }

  if (
    progress.neglectedSkill &&
    progress.neglectedSkill.daysSincePracticed !== null
  ) {
    const days =
      progress.neglectedSkill.daysSincePracticed;

    memories.push({
      id: "memory-neglected-skill",
      type: "focus",
      title: `${progress.neglectedSkill.name} needs attention`,
      summary:
        `${progress.neglectedSkill.name} has not been practiced for ${days} days.`,
      statement:
        `${progress.neglectedSkill.name} has been outside your active rhythm for ${days} days.`,
      importance:
        days >= 14
          ? 90
          : days >= 7
            ? 80
            : 60,
    });
  }

  if (momentum.burnoutRisk === "high") {
    memories.push({
      id: "memory-recovery-risk",
      type: "recovery",
      title: "Recovery needs protection",
      summary:
        "The current rhythm is showing elevated burnout risk.",
      statement:
        "Forge has detected a high risk of burnout.",
      importance: 95,
    });
  } else {
    memories.push({
      id: "memory-momentum",
      type: "momentum",
      title: "Current momentum",
      summary:
        `Your current momentum score is ${momentum.score}.`,
      statement:
        `Momentum is currently ${momentum.score}.`,
      importance: 55,
    });
  }

  const strongestIdentity =
    identity.strongestIdentity;

  if (strongestIdentity) {
    const identityName =
      strongestIdentity.identity.name;

    memories.push({
      id: "memory-strongest-identity",
      type: "identity",
      title: `${identityName} identity`,
      summary:
        `Recent behavior most strongly supports your ${identityName} identity.`,
      statement:
        `Your ${identityName} identity currently has the strongest evidence.`,
      importance: 80,
    });
  }

  const strongest = [...memories]
    .sort(
      (first, second) =>
        second.importance -
        first.importance,
    )
    .slice(0, 3);

  return {
    memories,
    strongest,
  };
}
import type {
  IdentityEngineResult,
  MomentumResult,
  ProgressSummary,
} from "@/features/forge-engine";

import type {
  ForgeMemory,
  MemoryResult,
} from "./memory.types";

type BuildMemoryOptions = {
  progress: ProgressSummary;
  momentum: MomentumResult;
  identity: IdentityEngineResult;
  observedAt?: string;
};

export function buildMemory({
  progress,
  momentum,
  identity,
  observedAt = new Date().toISOString(),
}: BuildMemoryOptions): MemoryResult {
  const memories: ForgeMemory[] = [];

  if (progress.strongestSkill) {
    memories.push({
      id: `strongest-skill-${progress.strongestSkill.skillId}`,
      category: "strength",
      statement: `${progress.strongestSkill.name} is currently your most reliable practice.`,
      confidence: calculateSkillConfidence(
        progress.strongestSkill.completedSessions,
      ),
      evidenceCount:
        progress.strongestSkill.completedSessions,
      lastObserved: observedAt,
    });
  }

  if (
    progress.neglectedSkill &&
    progress.neglectedSkill.daysSincePracticed !== null &&
    progress.neglectedSkill.daysSincePracticed >= 7
  ) {
    memories.push({
      id: `neglected-skill-${progress.neglectedSkill.skillId}`,
      category: "warning",
      statement: `${progress.neglectedSkill.name} tends to fall out of your active rhythm.`,
      confidence: Math.min(
        95,
        50 +
          progress.neglectedSkill.daysSincePracticed * 3,
      ),
      evidenceCount:
        progress.neglectedSkill.daysSincePracticed,
      lastObserved: observedAt,
    });
  }

  if (progress.completionRate >= 80) {
    memories.push({
      id: "high-follow-through",
      category: "habit",
      statement:
        "You are currently following through on most of the practices you schedule.",
      confidence: progress.completionRate,
      evidenceCount: progress.totalSessions,
      lastObserved: observedAt,
    });
  }

  if (
    progress.totalSessions >= 4 &&
    progress.completionRate < 50
  ) {
    memories.push({
      id: "overcommitted-plan",
      category: "pattern",
      statement:
        "Your plan may become less sustainable when too many sessions compete for attention.",
      confidence: Math.min(
        90,
        55 + progress.totalSessions * 3,
      ),
      evidenceCount: progress.totalSessions,
      lastObserved: observedAt,
    });
  }

  if (momentum.burnoutRisk === "high") {
    memories.push({
      id: "recovery-warning",
      category: "warning",
      statement:
        "Your recent rhythm suggests that recovery deserves more protection.",
      confidence: 90,
      evidenceCount: progress.totalSessions,
      lastObserved: observedAt,
    });
  }

  const strongestIdentity =
    identity.strongestIdentity;

  if (strongestIdentity) {
    memories.push({
      id: `identity-${strongestIdentity.identity.key}`,
      category: "identity",
      statement: `Your recent actions most strongly support your ${strongestIdentity.identity.name} identity.`,
      confidence: calculateIdentityConfidence(
        strongestIdentity.completedSessions,
      ),
      evidenceCount:
        strongestIdentity.completedSessions,
      lastObserved: observedAt,
    });
  }

  const sorted = [...memories].sort(
    (first, second) =>
      second.confidence - first.confidence ||
      second.evidenceCount - first.evidenceCount,
  );

  return {
    memories: sorted,
    strongest: sorted.slice(0, 3),
  };
}

function calculateSkillConfidence(
  completedSessions: number,
): number {
  return Math.min(
    95,
    45 + completedSessions * 8,
  );
}

function calculateIdentityConfidence(
  completedSessions: number,
): number {
  return Math.min(
    95,
    40 + completedSessions * 10,
  );
}
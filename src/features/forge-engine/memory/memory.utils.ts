import type {
  ForgeMemory,
  MemoryCandidate,
} from "./memory.types";

export function buildMemory(
  candidate: MemoryCandidate,
): ForgeMemory {
  const now =
    new Date().toISOString();

  return {
    id:
      typeof crypto !== "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : createFallbackId(),

    type: candidate.type,
    importance:
      candidate.importance,

    title:
      candidate.title,
    summary:
      candidate.summary,
    evidence:
      candidate.evidence,

    createdAt: now,
    updatedAt: now,

    sourceType:
      candidate.sourceType,
    sourceId:
      candidate.sourceId,

    lifeAreaId:
      candidate.lifeAreaId,
    skillId:
      candidate.skillId,
    sessionId:
      candidate.sessionId,
    reflectionId:
      candidate.reflectionId,

    confidence:
      clampScore(
        candidate.confidence,
      ),

    relevance:
      clampScore(
        candidate.relevance,
      ),

    metadata:
      candidate.metadata ?? {},

    expiresAt:
      candidate.expiresAt,
  };
}

export function clampScore(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      value,
    ),
  );
}

function createFallbackId(): string {
  return [
    "memory",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}
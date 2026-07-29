import type {
  DerivedMemory,
  MemoryResult,
} from "../../memory";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function normalizeImportance(
  importance: number,
): number {
  if (!Number.isFinite(importance)) {
    return 0;
  }

  const normalized =
    importance > 1
      ? importance / 100
      : importance;

  return Math.min(
    1,
    Math.max(
      0,
      normalized,
    ),
  );
}

function getMemoryPolarity(
  type: DerivedMemory["type"],
): AdvisorEvidence["polarity"] {
  if (
    type === "progress" ||
    type === "identity"
  ) {
    return "positive";
  }

  /*
   * Momentum, focus, and recovery memories may describe either
   * positive or negative circumstances. The current memory model
   * does not contain enough information to determine direction
   * reliably, so these remain neutral.
   */
  return "neutral";
}

function buildMemoryTags(
  memory: DerivedMemory,
  isStrongest: boolean,
): string[] {
  const tags = [
    "memory",
    memory.type,
  ];

  if (isStrongest) {
    tags.push(
      "strongest",
      "high-importance",
    );
  }

  return tags;
}

function buildMemoryEvidenceItem(
  memory: DerivedMemory,
  strongestIds: Set<string>,
): AdvisorEvidence {
  const importance =
    normalizeImportance(
      memory.importance,
    );

  const isStrongest =
    strongestIds.has(
      memory.id,
    );

  return {
    id: `memory-${memory.id}`,
    category: "memory",
    source: memory.type,
    statement:
      memory.statement.trim().length > 0
        ? memory.statement
        : memory.summary,
    confidence:
      Math.max(
        0.6,
        importance,
      ),
    impact:
      isStrongest
        ? Math.max(
            0.85,
            importance,
          )
        : importance,
    polarity:
      getMemoryPolarity(
        memory.type,
      ),
    tags:
      buildMemoryTags(
        memory,
        isStrongest,
      ),
  };
}

export function buildMemoryEvidence(
  memory: MemoryResult,
): AdvisorEvidence[] {
  const strongestIds = new Set(
    memory.strongest.map(
      (item) => item.id,
    ),
  );

  return memory.memories.map(
    (item) =>
      buildMemoryEvidenceItem(
        item,
        strongestIds,
      ),
  );
}
import type {
  MemoryMetadata,
  MemorySignal,
  MemorySignalType,
  MemorySourceType,
} from "./memory.types";

type CreateMemorySignalInput = {
  type: MemorySignalType;
  sourceType: MemorySourceType;

  sourceId?: string;
  userId?: string;
  lifeAreaId?: string;
  skillId?: string;
  sessionId?: string;
  reflectionId?: string;

  title?: string;
  description?: string;

  occurredAt?: string;
  metadata?: MemoryMetadata;
};

export function createMemorySignal({
  type,
  sourceType,
  sourceId,
  userId,
  lifeAreaId,
  skillId,
  sessionId,
  reflectionId,
  title,
  description,
  occurredAt,
  metadata = {},
}: CreateMemorySignalInput): MemorySignal {
  return {
    id: createSignalId(),
    type,
    occurredAt:
      occurredAt ??
      new Date().toISOString(),
    sourceType,
    sourceId,
    userId,
    lifeAreaId,
    skillId,
    sessionId,
    reflectionId,
    title,
    description,
    metadata,
  };
}

export function sessionCompletedSignal({
  userId,
  sessionId,
  skillId,
  lifeAreaId,
  title,
  durationMinutes,
  completedAt,
}: {
  userId?: string;
  sessionId: string;
  skillId?: string;
  lifeAreaId?: string;
  title: string;
  durationMinutes?: number;
  completedAt?: string;
}): MemorySignal {
  return createMemorySignal({
    type: "session_completed",
    sourceType: "practice_session",
    sourceId: sessionId,
    userId,
    sessionId,
    skillId,
    lifeAreaId,
    title,
    description: `${title} was completed.`,
    occurredAt: completedAt,
    metadata: {
      durationMinutes,
    },
  });
}

export function sessionSkippedSignal({
  userId,
  sessionId,
  skillId,
  lifeAreaId,
  title,
  skippedAt,
  reason,
}: {
  userId?: string;
  sessionId: string;
  skillId?: string;
  lifeAreaId?: string;
  title: string;
  skippedAt?: string;
  reason?: string;
}): MemorySignal {
  return createMemorySignal({
    type: "session_skipped",
    sourceType: "practice_session",
    sourceId: sessionId,
    userId,
    sessionId,
    skillId,
    lifeAreaId,
    title,
    description: `${title} was skipped.`,
    occurredAt: skippedAt,
    metadata: {
      reason,
    },
  });
}

export function reflectionCreatedSignal({
  userId,
  reflectionId,
  lifeAreaId,
  skillId,
  title = "Reflection recorded",
  reflection,
  createdAt,
}: {
  userId?: string;
  reflectionId: string;
  lifeAreaId?: string;
  skillId?: string;
  title?: string;
  reflection: string;
  createdAt?: string;
}): MemorySignal {
  return createMemorySignal({
    type: "reflection_created",
    sourceType: "reflection",
    sourceId: reflectionId,
    userId,
    reflectionId,
    lifeAreaId,
    skillId,
    title,
    description: reflection,
    occurredAt: createdAt,
    metadata: {
      reflection,
    },
  });
}

export function achievementUnlockedSignal({
  userId,
  achievementId,
  title,
  description,
  unlockedAt,
  metadata = {},
}: {
  userId?: string;
  achievementId: string;
  title: string;
  description?: string;
  unlockedAt?: string;
  metadata?: MemoryMetadata;
}): MemorySignal {
  return createMemorySignal({
    type: "achievement_unlocked",
    sourceType: "achievement",
    sourceId: achievementId,
    userId,
    title,
    description:
      description ??
      `${title} was unlocked.`,
    occurredAt: unlockedAt,
    metadata,
  });
}

function createSignalId(): string {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return [
    "signal",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
}
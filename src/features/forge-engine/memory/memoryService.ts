import type {
  Database,
  Json,
} from "@/integrations/supabase/types";

import type {
  ForgeMemory,
} from "./memory.types";

import {
  MemoryRepository,
} from "./MemoryRepository";

type ForgeMemoryInsert =
  Database["public"]["Tables"]["forge_memories"]["Insert"];

export type PersistMemoryInput = {
  userId: string;
  memory: ForgeMemory;
};

export async function persistForgeMemory({
  userId,
  memory,
}: PersistMemoryInput): Promise<ForgeMemory> {
  const sourceId =
    memory.sourceId ??
    memory.sessionId ??
    memory.reflectionId;

  if (sourceId) {
    const existing =
      await MemoryRepository.findBySource({
        userId,
        sourceType: memory.sourceType,
        sourceId,
      });

    if (existing) {
      return memory;
    }
  }

  const occurredAt =
    readString(
      memory.metadata.occurredAt,
    ) ?? memory.createdAt;

  const record: ForgeMemoryInsert = {
    id: memory.id,
    user_id: userId,

    memory_type: memory.type,
    importance: memory.importance,

    title: memory.title,
    summary: memory.summary,

    evidence:
      toJson(memory.evidence),

    source_type:
      memory.sourceType,

    source_id:
      memory.sourceId ?? null,

    life_area_id:
      memory.lifeAreaId ?? null,

    skill_id:
      memory.skillId ?? null,

    session_id:
      memory.sessionId ?? null,

    reflection_id:
      memory.reflectionId ?? null,

    confidence:
      memory.confidence,

    relevance:
      memory.relevance,

    metadata:
      toJson(memory.metadata),

    occurred_at:
      occurredAt,

    expires_at:
      memory.expiresAt ?? null,

    created_at:
      memory.createdAt,

    updated_at:
      memory.updatedAt ??
      memory.createdAt,
  };

  await MemoryRepository.insert(
    record,
  );

  return memory;
}

export async function processAndPersistMemory(
  userId: string,
  memory: ForgeMemory | null,
): Promise<ForgeMemory | null> {
  if (!memory) {
    return null;
  }

  return persistForgeMemory({
    userId,
    memory,
  });
}

function readString(
  value: unknown,
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function toJson(
  value: unknown,
): Json {
  return JSON.parse(
    JSON.stringify(value),
  ) as Json;
}
export type MemoryType =
  | "observation"
  | "pattern"
  | "achievement"
  | "setback"
  | "reflection"
  | "identity"
  | "decision"
  | "insight";

export type MemoryImportance =
  | "minor"
  | "normal"
  | "major"
  | "permanent";

export type MemorySourceType =
  | "practice_session"
  | "reflection"
  | "achievement"
  | "focus_item"
  | "advisor"
  | "system";

export type MemorySignalType =
  | "session_completed"
  | "session_skipped"
  | "reflection_created"
  | "achievement_unlocked"
  | "streak_reached"
  | "repeated_completion"
  | "repeated_skip"
  | "identity_evidence"
  | "manual";

export type MemoryMetadata =
  Record<string, unknown>;

export interface ForgeMemory {
  id: string;

  type: MemoryType;
  importance: MemoryImportance;

  title: string;
  summary: string;
  evidence: string[];

  createdAt: string;
  updatedAt?: string;

  sourceType: MemorySourceType;
  sourceId?: string;

  lifeAreaId?: string;
  skillId?: string;
  sessionId?: string;
  reflectionId?: string;

  confidence: number;
  relevance: number;

  metadata: MemoryMetadata;

  expiresAt?: string;
}

export interface MemorySignal {
  id: string;

  type: MemorySignalType;
  occurredAt: string;

  sourceType: MemorySourceType;
  sourceId?: string;

  userId?: string;
  lifeAreaId?: string;
  skillId?: string;
  sessionId?: string;
  reflectionId?: string;

  title?: string;
  description?: string;

  metadata: MemoryMetadata;
}

export interface MemoryCandidate {
  type: MemoryType;
  importance: MemoryImportance;

  title: string;
  summary: string;
  evidence: string[];

  sourceType: MemorySourceType;
  sourceId?: string;

  lifeAreaId?: string;
  skillId?: string;
  sessionId?: string;
  reflectionId?: string;

  confidence: number;
  relevance: number;

  metadata: MemoryMetadata;

  expiresAt?: string;
}

export interface MemoryRetrievalContext {
  purpose:
    | "today"
    | "advisor"
    | "weekly_story"
    | "identity"
    | "general";

  now?: string;

  lifeAreaId?: string;
  skillId?: string;

  limit?: number;

  minimumImportance?: MemoryImportance;
  minimumConfidence?: number;
}

export interface MemoryRetrievalResult {
  memories: ForgeMemory[];

  totalConsidered: number;

  context: MemoryRetrievalContext;
}
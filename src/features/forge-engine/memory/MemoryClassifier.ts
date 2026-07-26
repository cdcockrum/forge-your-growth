import type {
  MemoryCandidate,
  MemorySignal,
  MemoryType,
} from "./memory.types";

import {
  MemoryScoring,
} from "./MemoryScoring";

export class MemoryClassifier {
  static classify(
    signal: MemorySignal,
  ): MemoryCandidate | null {
    const scoring =
      MemoryScoring.scoreSignal(
        signal,
      );

    /*
     * Ordinary single-session events remain signals,
     * but do not become long-term memories unless
     * additional context raises their importance.
     */
    if (scoring.score < 40) {
      return null;
    }

    return {
      type:
        classifyMemoryType(
          signal,
        ),

      importance:
        scoring.importance,

      title:
        buildTitle(signal),

      summary:
        buildSummary(signal),

      evidence:
        buildEvidence(signal),

      sourceType:
        signal.sourceType,

      sourceId:
        signal.sourceId,

      lifeAreaId:
        signal.lifeAreaId,

      skillId:
        signal.skillId,

      sessionId:
        signal.sessionId,

      reflectionId:
        signal.reflectionId,

      confidence:
        scoring.confidence,

      relevance:
        scoring.relevance,

      metadata: {
        ...signal.metadata,

        signalId:
          signal.id,

        signalType:
          signal.type,

        occurredAt:
          signal.occurredAt,

        memoryScore:
          scoring.score,
      },

      expiresAt:
        expirationFor(
          scoring.importance,
        ),
    };
  }
}

function classifyMemoryType(
  signal: MemorySignal,
): MemoryType {
  switch (signal.type) {
    case "achievement_unlocked":
    case "streak_reached":
      return "achievement";

    case "repeated_completion":
      return "pattern";

    case "repeated_skip":
      return "setback";

    case "reflection_created":
      return "reflection";

    case "identity_evidence":
      return "identity";

    case "session_skipped":
      return "setback";

    case "session_completed":
      return "observation";

    case "manual":
      return "insight";
  }
}

function buildTitle(
  signal: MemorySignal,
): string {
  if (signal.title?.trim()) {
    switch (signal.type) {
      case "session_completed":
        return `${signal.title} completed`;

      case "session_skipped":
        return `${signal.title} skipped`;

      default:
        return signal.title.trim();
    }
  }

  switch (signal.type) {
    case "achievement_unlocked":
      return "Achievement unlocked";

    case "streak_reached":
      return "Practice streak reached";

    case "repeated_completion":
      return "Consistent practice pattern";

    case "repeated_skip":
      return "Repeated missed practice";

    case "reflection_created":
      return "Meaningful reflection";

    case "identity_evidence":
      return "Identity evidence";

    case "session_completed":
      return "Practice completed";

    case "session_skipped":
      return "Practice skipped";

    case "manual":
      return "Recorded insight";
  }
}

function buildSummary(
  signal: MemorySignal,
): string {
  if (
    signal.description?.trim()
  ) {
    return signal.description.trim();
  }

  switch (signal.type) {
    case "achievement_unlocked":
      return "A meaningful achievement was added to the user’s development history.";

    case "streak_reached":
      return "A sustained practice streak demonstrates growing consistency.";

    case "repeated_completion":
      return "Repeated completion suggests this practice is becoming reliable.";

    case "repeated_skip":
      return "Repeated missed sessions suggest an obstacle or scheduling mismatch.";

    case "reflection_created":
      return "The user recorded a reflection that may contain meaningful learning.";

    case "identity_evidence":
      return "Recent actions provide evidence of an emerging identity.";

    case "session_completed":
      return "A planned practice session was completed.";

    case "session_skipped":
      return "A planned practice session was skipped.";

    case "manual":
      return "A meaningful insight was manually recorded.";
  }
}

function buildEvidence(
  signal: MemorySignal,
): string[] {
  const evidence: string[] = [];

  if (signal.description?.trim()) {
    evidence.push(
      signal.description.trim(),
    );
  }

  if (signal.title?.trim()) {
    evidence.push(
      `Related activity: ${signal.title.trim()}`,
    );
  }

  const durationMinutes =
    signal.metadata.durationMinutes;

  if (
    typeof durationMinutes ===
      "number" &&
    Number.isFinite(
      durationMinutes,
    )
  ) {
    evidence.push(
      `Duration: ${durationMinutes} minutes`,
    );
  }

  const streakLength =
    signal.metadata.streakLength;

  if (
    typeof streakLength ===
      "number" &&
    Number.isFinite(
      streakLength,
    )
  ) {
    evidence.push(
      `Streak: ${streakLength}`,
    );
  }

  evidence.push(
    `Observed ${signal.occurredAt}`,
  );

  return evidence;
}

function expirationFor(
  importance:
    | "minor"
    | "normal"
    | "major"
    | "permanent",
): string | undefined {
  if (
    importance ===
    "permanent"
  ) {
    return undefined;
  }

  const expiresAt =
    new Date();

  switch (importance) {
    case "major":
      expiresAt.setFullYear(
        expiresAt.getFullYear() +
          2,
      );
      break;

    case "normal":
      expiresAt.setMonth(
        expiresAt.getMonth() +
          6,
      );
      break;

    case "minor":
      expiresAt.setDate(
        expiresAt.getDate() +
          30,
      );
      break;
  }

  return expiresAt.toISOString();
}
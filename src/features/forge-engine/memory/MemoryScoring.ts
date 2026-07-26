import type {
  MemoryImportance,
  MemorySignal,
} from "./memory.types";

export type MemoryScore = {
  score: number;
  confidence: number;
  relevance: number;
  importance: MemoryImportance;
};

export class MemoryScoring {
  static scoreSignal(
    signal: MemorySignal,
  ): MemoryScore {
    let score = 0;

    switch (signal.type) {
      case "achievement_unlocked":
        score += 75;
        break;

      case "streak_reached":
        score += 70;
        break;

      case "repeated_completion":
        score += 65;
        break;

      case "repeated_skip":
        score += 70;
        break;

      case "identity_evidence":
        score += 65;
        break;

      case "reflection_created":
        score += 45;
        break;

      case "session_skipped":
        score += 25;
        break;

      case "session_completed":
        score += 20;
        break;

      case "manual":
        score += 60;
        break;
    }

    const durationMinutes =
      readNumber(
        signal.metadata.durationMinutes,
      );

    if (
      durationMinutes !== null &&
      durationMinutes >= 60
    ) {
      score += 10;
    }

    const streakLength =
      readNumber(
        signal.metadata.streakLength,
      );

    if (streakLength !== null) {
      if (streakLength >= 100) {
        score += 30;
      } else if (streakLength >= 30) {
        score += 25;
      } else if (streakLength >= 7) {
        score += 15;
      }
    }

    const occurrenceCount =
      readNumber(
        signal.metadata.occurrenceCount,
      );

    if (
      occurrenceCount !== null
    ) {
      score += Math.min(
        occurrenceCount * 4,
        20,
      );
    }

    const hasMeaningfulDescription =
      Boolean(
        signal.description?.trim(),
      );

    if (hasMeaningfulDescription) {
      score += 5;
    }

    const normalizedScore =
      clamp(
        score,
        0,
        100,
      );

    return {
      score: normalizedScore,

      confidence: clamp(
        normalizedScore / 100,
        0.2,
        0.95,
      ),

      relevance: calculateRelevance(
        signal,
        normalizedScore,
      ),

      importance:
        importanceFromScore(
          normalizedScore,
        ),
    };
  }
}

function calculateRelevance(
  signal: MemorySignal,
  score: number,
): number {
  let relevance =
    score / 100;

  if (
    signal.skillId ||
    signal.lifeAreaId
  ) {
    relevance += 0.05;
  }

  if (
    signal.type ===
      "repeated_completion" ||
    signal.type ===
      "repeated_skip" ||
    signal.type ===
      "identity_evidence"
  ) {
    relevance += 0.1;
  }

  return clamp(
    relevance,
    0,
    1,
  );
}

function importanceFromScore(
  score: number,
): MemoryImportance {
  if (score >= 90) {
    return "permanent";
  }

  if (score >= 70) {
    return "major";
  }

  if (score >= 40) {
    return "normal";
  }

  return "minor";
}

function readNumber(
  value: unknown,
): number | null {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : null;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    Math.max(
      value,
      minimum,
    ),
    maximum,
  );
}
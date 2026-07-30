import type { DetectedPattern } from "../pattern.types";

export function hasPattern(
  patterns: readonly DetectedPattern[],
  id: DetectedPattern["id"],
): boolean {
  return patterns.some((pattern) => pattern.id === id);
}

export function getPattern(
  patterns: readonly DetectedPattern[],
  id: DetectedPattern["id"],
): DetectedPattern | undefined {
  return patterns.find((pattern) => pattern.id === id);
}

export function averageConfidence(
  ...patterns: DetectedPattern[]
): number {
  if (patterns.length === 0) {
    return 0;
  }

  return (
    patterns.reduce((sum, pattern) => sum + pattern.confidence, 0) /
    patterns.length
  );
}

export function maxImportance(
  ...patterns: DetectedPattern[]
): number {
  return Math.max(
    ...patterns.map((pattern) => pattern.importance),
  );
}

export function mergeEvidence(
  ...patterns: DetectedPattern[]
) {
  return Array.from(
    new Set(
      patterns.flatMap((pattern) => pattern.evidence),
    ),
  );
}
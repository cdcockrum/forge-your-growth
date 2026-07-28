import type {
  ForgePattern,
  PatternConfidence,
} from "./pattern.types";

export function scorePattern(
  pattern: ForgePattern,
): number {
  return (
    confidenceWeight(
      pattern.confidence,
    ) +
    Math.min(
      40,
      pattern.evidenceCount * 5,
    )
  );
}

export function sortPatterns(
  patterns: ForgePattern[],
): ForgePattern[] {
  return [...patterns].sort(
    (first, second) =>
      scorePattern(second) -
      scorePattern(first),
  );
}

function confidenceWeight(
  confidence: PatternConfidence,
): number {
  switch (confidence) {
    case "high":
      return 60;

    case "medium":
      return 40;

    case "low":
      return 20;
  }
}
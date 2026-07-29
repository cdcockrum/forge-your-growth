import type {
  ForgePattern,
  PatternConfidence,
  PatternSummary,
} from "../../patterns";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function confidenceScore(
  confidence: PatternConfidence,
): number {
  switch (confidence) {
    case "high":
      return 0.95;

    case "medium":
      return 0.8;

    case "low":
      return 0.6;
  }
}

function impactScore(
  pattern: ForgePattern,
  strongest: boolean,
): number {
  const base = Math.min(
    1,
    Math.max(
      0.4,
      pattern.evidenceCount / 10,
    ),
  );

  return strongest
    ? Math.max(base, 0.9)
    : base;
}

function buildTags(
  pattern: ForgePattern,
  strongest: boolean,
): string[] {
  const tags = [
    "pattern",
  ];

  if (strongest) {
    tags.push(
      "strongest",
    );
  }

  return tags;
}

function buildPatternEvidenceItem(
  pattern: ForgePattern,
  strongestPatternId: string | null,
): AdvisorEvidence {
  const strongest =
    pattern.id === strongestPatternId;

  const statement =
    pattern.recommendation?.trim().length
      ? `${pattern.description} Recommendation: ${pattern.recommendation}`
      : pattern.description;

  return {
    id: `pattern-${pattern.id}`,
    category: "pattern",
    source: pattern.title,
    statement,
    confidence:
      confidenceScore(
        pattern.confidence,
      ),
    impact:
      impactScore(
        pattern,
        strongest,
      ),
    polarity: "neutral",
    tags:
      buildTags(
        pattern,
        strongest,
      ),
  };
}

export function buildPatternEvidence(
  patterns: PatternSummary,
): AdvisorEvidence[] {
  const strongestId =
    patterns.strongestPattern?.id ??
    null;

  return patterns.patterns.map(
    (pattern) =>
      buildPatternEvidenceItem(
        pattern,
        strongestId,
      ),
  );
}
import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  EvidenceQuality,
} from "./epistemology.types";

export function determineEvidenceQuality(
  evidence: AdvisorEvidence[],
  reasoning: ReasoningResult,
): EvidenceQuality {
  if (
    evidence.length === 0 ||
    reasoning.graph.nodes.length === 0
  ) {
    return "weak";
  }

  const averageConfidence =
    average(
      evidence.map(
        (item) =>
          normalizeConfidence(
            item.confidence,
          ),
      ),
    );

  const averageImpact =
    average(
      evidence.map(
        (item) =>
          normalizeConfidence(
            item.impact,
          ),
      ),
    );

  const categoryDiversity =
    new Set(
      evidence.map(
        (item) =>
          item.category,
      ),
    ).size;

  const contradictionPenalty =
    reasoning.evaluation
      .contradictions.length > 0
      ? 0.2
      : 0;

  const gapPenalty =
    reasoning.evaluation
      .gaps.length > 0
      ? 0.1
      : 0;

  const diversityScore =
    Math.min(
      categoryDiversity / 4,
      1,
    );

  const qualityScore =
    clamp01(
      averageConfidence * 0.4 +
      averageImpact * 0.3 +
      diversityScore * 0.3 -
      contradictionPenalty -
      gapPenalty,
    );

  if (
    qualityScore >= 0.75 &&
    evidence.length >= 4 &&
    categoryDiversity >= 3
  ) {
    return "strong";
  }

  if (
    qualityScore >= 0.45
  ) {
    return "moderate";
  }

  return "weak";
}

function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0,
    ) / values.length
  );
}

function normalizeConfidence(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return clamp01(
    normalized,
  );
}

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      value,
      1,
    ),
  );
}
import type {
  ReasoningResult,
} from "../reasoning";

import type {
  BeliefStrength,
} from "./epistemology.types";

export function determineBeliefStrength(
  reasoning: ReasoningResult,
): BeliefStrength {
  const confidence =
    normalizeConfidence(
      reasoning.interpretation
        .confidence,
    );

  const evidenceCount =
    reasoning.graph.nodes.length;

  const contradictionCount =
    reasoning.evaluation
      .contradictions.length;

  if (
    evidenceCount === 0 ||
    !reasoning.interpretation
      .strongest
  ) {
    return "tentative";
  }

  if (
    confidence >= 0.85 &&
    contradictionCount === 0 &&
    evidenceCount >= 3
  ) {
    return "stable";
  }

  if (
    confidence >= 0.6
  ) {
    return "developing";
  }

  return "tentative";
}

function normalizeConfidence(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}
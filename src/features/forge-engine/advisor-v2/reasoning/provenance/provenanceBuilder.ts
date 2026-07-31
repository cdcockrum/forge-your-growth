import type {
  EvaluationResult,
} from "../evaluation";

import type {
  Interpretation,
} from "../reasoning.types";

import type {
  RecommendationProvenance,
} from "./provenance.types";

export function buildRecommendationProvenance(
  interpretation: Interpretation,
  evaluation: EvaluationResult,
): RecommendationProvenance {
  return {
    hypothesisIds:
      interpretation.strongest
        ? [interpretation.strongest.id]
        : [],

    evidenceIds: [
      ...interpretation.supportingEvidence,
    ],

    conflictIds:
      evaluation.contradictions.map(
        (contradiction) =>
          contradiction.id,
      ),

    gapIds:
      evaluation.gaps.map(
        (gap) =>
          gap.id,
      ),

    explanation:
      interpretation.summary,
  };
}
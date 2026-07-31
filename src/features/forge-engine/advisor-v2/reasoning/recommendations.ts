import type {
  Recommendation,
  RecommendationPriority,
  Interpretation,
} from "./reasoning.types";

import type {
  EvaluationResult,
} from "./evaluation";

import {
  buildRecommendationProvenance,
} from "./provenance";

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

function determinePriority(
  confidence: number,
): RecommendationPriority {
  if (confidence >= 0.8) {
    return "high";
  }

  if (confidence >= 0.55) {
    return "medium";
  }

  return "low";
}

function adjustPriorityForEvaluation(
  priority: RecommendationPriority,
  evaluation: EvaluationResult,
): RecommendationPriority {
  const hasHighUncertainty =
    evaluation.consistencyScore < 0.5 ||
    evaluation.contradictions.length > 0;

  if (hasHighUncertainty) {
    return "low";
  }

  const hasModerateUncertainty =
    evaluation.consistencyScore < 0.7 ||
    evaluation.competingHypotheses.length > 0 ||
    evaluation.gaps.length > 0;

  if (
    hasModerateUncertainty &&
    priority === "high"
  ) {
    return "medium";
  }

  return priority;
}

function buildTitle(
  interpretation: Interpretation,
): string {
  if (!interpretation.strongest) {
    return "Gather more evidence";
  }

  return interpretation.strongest.title;
}

function buildDescription(
  interpretation: Interpretation,
  evaluation: EvaluationResult,
): string {
  if (!interpretation.strongest) {
    return (
      "Continue recording practice, reflections, and progress " +
      "before making significant changes."
    );
  }

  const hasSubstantialUncertainty =
    evaluation.consistencyScore < 0.55 ||
    evaluation.competingHypotheses.length > 0 ||
    evaluation.contradictions.length > 0;

  if (hasSubstantialUncertainty) {
    return (
      interpretation.strongest.description +
      " Treat this as a working direction while gathering " +
      "more evidence before making significant changes."
    );
  }

  if (evaluation.gaps.length > 0) {
    return (
      interpretation.strongest.description +
      " Continue cautiously in this direction while filling " +
      "the remaining evidence gaps."
    );
  }

  return (
    interpretation.strongest.description +
    " Continue reinforcing this direction while monitoring for changes."
  );
}

function buildRationale(
  interpretation: Interpretation,
  evaluation: EvaluationResult,
): string[] {
  const rationale: string[] = [
    interpretation.summary,
  ];

  if (interpretation.strongest) {
    rationale.push(
      ...interpretation.strongest.rationale,
    );
  }

  if (
    evaluation.competingHypotheses.length > 0
  ) {
    rationale.push(
      "Alternative explanations remain plausible and should continue to be tested."
    );
  }

  if (
    evaluation.contradictions.length > 0
  ) {
    rationale.push(
      "Contradictory evidence reduces confidence in making a strong change."
    );
  } else if (
    interpretation.conflictingEvidence.length > 0
  ) {
    rationale.push(
      "Some evidence remains unresolved, so continue validating this interpretation."
    );
  }

  if (evaluation.gaps.length > 0) {
    rationale.push(
      "Additional evidence would improve the reliability of this recommendation."
    );
  }

  return rationale;
}

export function buildRecommendations(
  interpretation: Interpretation,
  evaluation: EvaluationResult,
): Recommendation[] {
  const confidence =
    clamp01(
      interpretation.confidence,
    );

  const basePriority =
    determinePriority(
      confidence,
    );

  const provenance =
  buildRecommendationProvenance(
    interpretation,
    evaluation,
  );

  return [
  {
    id: "primary-recommendation",

    title:
      buildTitle(
        interpretation,
      ),

    description:
      buildDescription(
        interpretation,
        evaluation,
      ),

    rationale:
      buildRationale(
        interpretation,
        evaluation,
      ),

    supportingEvidence: [
      ...interpretation.supportingEvidence,
    ],

    confidence,

    priority:
      adjustPriorityForEvaluation(
        basePriority,
        evaluation,
      ),

    provenance,
  },
];
}
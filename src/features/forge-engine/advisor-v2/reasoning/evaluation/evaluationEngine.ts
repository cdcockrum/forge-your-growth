import type {
  Hypothesis,
  ReasoningAnalysis,
} from "../reasoning.types";

import type {
  EvaluationResult,
} from "./evaluation.types";

export function evaluateReasoning(
  analysis: ReasoningAnalysis,
  hypotheses: Hypothesis[],
): EvaluationResult {
  const competingHypotheses =
    findCompetingHypotheses(hypotheses);

  const consistencyScore =
    calculateConsistencyScore(
      analysis,
      competingHypotheses,
    );

  return {
    contradictions:
      analysis.contradictions,

    tensions:
      analysis.tensions,

    gaps:
      analysis.gaps,

    competingHypotheses,

    consistencyScore,
  };
}

function findCompetingHypotheses(
  hypotheses: Hypothesis[],
): Hypothesis[] {
  if (hypotheses.length <= 1) {
    return [];
  }

  const sorted = [...hypotheses].sort(
    (left, right) =>
      right.confidence - left.confidence,
  );

  const strongest =
    sorted[0];

  if (!strongest) {
    return [];
  }

  return sorted
    .slice(1)
    .filter(
      (hypothesis) =>
        strongest.confidence -
          hypothesis.confidence <=
        0.2,
    );
}

function calculateConsistencyScore(
  analysis: ReasoningAnalysis,
  competingHypotheses: Hypothesis[],
): number {
  const contradictionPenalty =
    averageSeverity(
      analysis.contradictions.map(
        (contradiction) =>
          contradiction.severity,
      ),
    ) * 0.45;

  const tensionPenalty =
    averageSeverity(
      analysis.tensions.map(
        (tension) =>
          tension.severity,
      ),
    ) * 0.25;

  const gapPenalty =
    averageSeverity(
      analysis.gaps.map(
        (gap) =>
          gap.importance,
      ),
    ) * 0.2;

  const competitionPenalty =
    Math.min(
      competingHypotheses.length * 0.05,
      0.1,
    );

  return clamp(
    1 -
      contradictionPenalty -
      tensionPenalty -
      gapPenalty -
      competitionPenalty,
  );
}

function averageSeverity(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + normalizeScore(value),
    0,
  );

  return total / values.length;
}

function normalizeScore(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  /*
   * Supports scores already represented
   * as 0–1 as well as scores represented
   * as 0–100.
   */
  return value > 1
    ? clamp(value / 100)
    : clamp(value);
}

function clamp(
  value: number,
): number {
  return Math.min(
    1,
    Math.max(0, value),
  );
}
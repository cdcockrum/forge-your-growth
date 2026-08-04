import type {
  AdvisorAdaptiveLearning,
} from "./adaptiveLearning.types";

export type LearningNarrative = {
  headline: string;

  summary: string;

  confidenceStatement: string;

  evidenceStatement: string;

  nextStep: string;
};

export function buildLearningNarrative(
  learning: AdvisorAdaptiveLearning,
): LearningNarrative {

  const {
    summary,
  } = learning;

  const improving =
    summary.averageConfidenceAdjustment >= 0;

  const headline =
    improving
      ? "Forge is becoming more confident."
      : "Forge is still calibrating.";

  const summaryText =
    improving
      ? `Recent outcomes have reinforced ${summary.successfulCount} recommendation${summary.successfulCount === 1 ? "" : "s"}.`
      : "Recent outcomes suggest additional evidence is needed before stronger conclusions can be drawn.";

  const confidenceStatement =
    `Current recommendation confidence is changing by an average of ${Math.round(
      Math.abs(
        summary.averageConfidenceAdjustment,
      ) * 100,
    )}% per evaluation.`;

  const evidenceStatement =
    `${summary.evaluatedCount} recommendation evaluations currently support Forge's coaching decisions.`;

  const nextStep =
    improving
      ? "Continue gathering evidence to strengthen long-term recommendations."
      : "Additional observations will improve recommendation reliability.";

  return {
    headline,
    summary: summaryText,
    confidenceStatement,
    evidenceStatement,
    nextStep,
  };
}
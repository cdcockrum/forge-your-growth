import type {
  EvidenceContradiction,
  EvidenceGap,
  EvidenceTension,
  Hypothesis,
} from "../reasoning.types";

export type EvaluationResult = {
  /**
   * Contradictions found during evidence
   * relationship analysis.
   */
  contradictions: EvidenceContradiction[];

  /**
   * Meaningful tensions that weaken the
   * certainty of an interpretation.
   */
  tensions: EvidenceTension[];

  /**
   * Missing evidence that limits the
   * reasoning system's confidence.
   */
  gaps: EvidenceGap[];

  /**
   * Plausible alternatives to the
   * strongest hypothesis.
   */
  competingHypotheses: Hypothesis[];

  /**
   * Overall internal consistency of the
   * reasoning result, from 0 to 1.
   */
  consistencyScore: number;
};
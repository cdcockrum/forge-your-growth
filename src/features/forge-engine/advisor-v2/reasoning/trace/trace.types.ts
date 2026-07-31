import type {
  EvaluationResult,
} from "../evaluation";

import type {
  Interpretation,
  Hypothesis,
  ReasoningAnalysis,
} from "../reasoning.types";

export type ReasoningStep = {
  stage:
    | "analysis"
    | "hypothesis"
    | "evaluation"
    | "interpretation"
    | "recommendation";

  title: string;

  explanation: string;

  evidenceIds: string[];
};

export type ReasoningTrace = {
  generatedAt: string;

  strongestHypothesis:
    Hypothesis | null;

  interpretation: Interpretation;

  evaluation: EvaluationResult;

  analysis: ReasoningAnalysis;

  steps: ReasoningStep[];
};
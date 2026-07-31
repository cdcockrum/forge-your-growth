import type {
  EvaluationResult,
} from "../evaluation";

import type {
  Interpretation,
  ReasoningAnalysis,
} from "../reasoning.types";

import type {
  ReasoningStep,
  ReasoningTrace,
} from "./trace.types";

export function buildReasoningTrace(
  interpretation: Interpretation,
  analysis: ReasoningAnalysis,
  evaluation: EvaluationResult,
): ReasoningTrace {
  const steps: ReasoningStep[] = [
    {
      stage: "analysis",
      title:
        "Analyze evidence relationships",
      explanation:
        "Evidence relationships were evaluated for agreements, tensions, contradictions, and gaps.",
      evidenceIds: [],
    },
    {
      stage: "hypothesis",
      title:
        "Generate hypotheses",
      explanation:
        "Possible explanations were generated from the analyzed evidence.",
      evidenceIds:
        interpretation.strongest
          ?.supportingEvidence ?? [],
    },
    {
      stage: "evaluation",
      title:
        "Evaluate reasoning",
      explanation:
        "The hypotheses were evaluated for consistency and competing explanations.",
      evidenceIds: [],
    },
    {
      stage: "interpretation",
      title:
        "Interpret results",
      explanation:
        interpretation.summary,
      evidenceIds: [
        ...interpretation.supportingEvidence,
      ],
    },
    {
      stage: "recommendation",
      title:
        "Generate recommendation",
      explanation:
        "Recommendations were generated from the strongest supported interpretation.",
      evidenceIds: [
        ...interpretation.supportingEvidence,
      ],
    },
  ];

  return {
    generatedAt:
      new Date().toISOString(),

    strongestHypothesis:
      interpretation.strongest,

    interpretation,

    evaluation,

    analysis,

    steps,
  };
}
import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  ReasoningViewModel,
} from "../cognitiveViewModel";

export function buildReasoningViewModel(
  advisor: AdvisorResult,
): ReasoningViewModel {
  const {
    reasoning,
    epistemology,
  } = advisor;

  return {
    evidenceCount:
      advisor.evidence.length,

    graphNodeCount:
      reasoning.graph.nodes.length,

    graphEdgeCount:
      reasoning.graph.edges.length,

    hypothesisCount:
      reasoning.hypotheses.length,

    contradictionCount:
      reasoning.evaluation
        .contradictions.length,

    gapCount:
      reasoning.evaluation
        .gaps.length,

    assumptionCount:
      epistemology.assumptions.length,

    uncertaintyCount:
      epistemology.uncertainties.length,

    interpretationConfidence:
      normalizeScore(
        reasoning.interpretation
          .confidence,
      ),

    consistencyScore:
      normalizeScore(
        reasoning.evaluation
          .consistencyScore,
      ),

    strongestHypothesis:
      reasoning.interpretation
        .strongest?.title ??
      null,

    strongestInterpretation:
      reasoning.interpretation
        .strongest?.description ??
      null,
  };
}

function normalizeScore(
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